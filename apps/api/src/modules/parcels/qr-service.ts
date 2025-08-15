import { prisma } from '#core';
import { BadRequestException, NotFoundException } from '../../utils';
import { ParcelStatus } from './types';

export class QRService {
  static async generateQRToken(parcelId: number) {
    // Parcel'ı kontrol et
    const parcel = await prisma.parcel.findUnique({
      where: { id: parcelId },
      include: {
        order: { include: { user: true } },
        courier: true
      }
    });

    if (!parcel) {
      throw new NotFoundException('Kargo bulunamadı');
    }

    if (parcel.status !== ParcelStatus.OUT_FOR_DELIVERY) {
      throw new BadRequestException('QR kod sadece dağıtıma çıkmış kargolar için oluşturulabilir');
    }

    const existingToken = await prisma.qRToken.findFirst({
      where: {
        parcelId,
        isUsed: false,
        expiresAt: { gt: new Date() }
      }
    });

    if (existingToken) {
      return {
        token: existingToken.token,
        qrCode: this.generateQRCodeData(existingToken.token),
        expiresAt: existingToken.expiresAt,
        parcel: {
          trackingNumber: parcel.trackingNumber,
          customerName: `${parcel.order.user.firstName} ${parcel.order.user.lastName}`,
          customerEmail: parcel.order.user.email
        }
      };
    }

    const token = this.generateUniqueToken();
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 saat

    const qrToken = await prisma.qRToken.create({
      data: {
        parcelId,
        token,
        expiresAt,
      }
    });

    await this.createQREvent(parcelId, 'QR_GENERATED', 'Teslimat için QR kod oluşturuldu', parcel.courierId);

    return {
      token: qrToken.token,
      qrCode: this.generateQRCodeData(token),
      expiresAt: qrToken.expiresAt,
      parcel: {
        trackingNumber: parcel.trackingNumber,
        customerName: `${parcel.order.user.firstName} ${parcel.order.user.lastName}`,
        customerEmail: parcel.order.user.email
      }
    };
  }

  static async validateQRToken(token: string, courierId?: string) {
    // QR token'ı bul
    const qrToken = await prisma.qRToken.findUnique({
      where: { token },
      include: {
        parcel: {
          include: {
            order: { include: { user: true } },
            courier: true
          }
        }
      }
    });

    if (!qrToken) {
      throw new NotFoundException('Geçersiz QR kod');
    }

    // Token kullanılmış mı?
    if (qrToken.isUsed) {
      throw new BadRequestException('Bu QR kod daha önce kullanılmış');
    }

    // Token süresi dolmuş mu?
    if (qrToken.expiresAt < new Date()) {
      throw new BadRequestException('QR kod süresi dolmuş');
    }

    // Kurye kontrolü (opsiyonel)
    if (courierId && qrToken.parcel.courierId !== courierId) {
      throw new BadRequestException('Bu QR kod size atanmamış');
    }

    // Token'ı kullanılmış olarak işaretle
    await prisma.qRToken.update({
      where: { id: qrToken.id },
      data: {
        isUsed: true,
        usedAt: new Date()
      }
    });

    // Parcel durumunu DELIVERED yap
    const deliveredParcel = await prisma.parcel.update({
      where: { id: qrToken.parcelId },
      data: {
        status: ParcelStatus.DELIVERED,
        actualDelivery: new Date()
      }
    });

    // Teslimat event'i ekle
    await this.createQREvent(
      qrToken.parcelId, 
      'DELIVERED', 
      'Paket QR kod ile başarıyla teslim edildi', 
      qrToken.parcel.courierId
    );

    return {
      success: true,
      parcel: {
        uuid: qrToken.parcel.uuid,
        trackingNumber: qrToken.parcel.trackingNumber,
        status: ParcelStatus.DELIVERED,
        customerName: `${qrToken.parcel.order.user.firstName} ${qrToken.parcel.order.user.lastName}`,
        deliveredAt: new Date()
      },
      message: 'Teslimat başarıyla tamamlandı'
    };
  }

  static async getQRTokenInfo(token: string) {
    const qrToken = await prisma.qRToken.findUnique({
      where: { token },
      include: {
        parcel: {
          include: {
            order: { include: { user: true } },
            courier: true
          }
        }
      }
    });

    if (!qrToken) {
      throw new NotFoundException('QR token bulunamadı');
    }

    return {
      token: qrToken.token,
      qrCode: this.generateQRCodeData(token),
      expiresAt: qrToken.expiresAt,
      isUsed: qrToken.isUsed,
      parcel: {
        trackingNumber: qrToken.parcel.trackingNumber,
        customerName: `${qrToken.parcel.order.user.firstName} ${qrToken.parcel.order.user.lastName}`,
        shippingAddress: qrToken.parcel.shippingAddress,
        courier: qrToken.parcel.courier ? {
          name: `${qrToken.parcel.courier.firstName} ${qrToken.parcel.courier.lastName}`,
          phone: qrToken.parcel.courier.email // Telefon numarası yoksa email
        } : null
      }
    };
  }

  static async getActiveQRToken(parcelId: number) {
    const qrToken = await prisma.qRToken.findFirst({
      where: {
        parcelId,
        isUsed: false,
        expiresAt: { gt: new Date() }
      }
    });

    return qrToken;
  }

  private static generateUniqueToken(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    const random2 = Math.random().toString(36).substring(2, 15);
    
    return `QR_${timestamp}_${random}${random2}`.toUpperCase();
  }

  private static generateQRCodeData(token: string): string {
    // QR kod içinde validation URL'i olacak
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    return `${baseUrl}/api/parcels/validate-qr?token=${token}`;
  }

  private static async createQREvent(
    parcelId: number, 
    eventType: string, 
    description: string, 
    courierId?: string | null
  ) {
    await prisma.parcelEvent.create({
      data: {
        parcelId,
        eventType,
        description,
        courierId,
        metadata: {
          qrRelated: true,
          timestamp: new Date().toISOString()
        }
      }
    });
  }

  static async cleanupExpiredTokens() {
    const result = await prisma.qRToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
        isUsed: false
      }
    });

    console.log(`🧹 ${result.count} süresi dolmuş QR token silindi`);
    return result;
  }
}
