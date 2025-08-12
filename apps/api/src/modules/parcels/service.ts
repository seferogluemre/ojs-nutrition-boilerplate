import { prisma } from '#core';

import { BadRequestException, NotFoundException } from '../../utils';
import {
  type ParcelCoordinates,
  type ParcelEventMetadata,
  type ParcelRoute,
  ParcelStatus,
} from './types';

export class ParcelService {
  static async create(data: {
    orderId: string;
    courierId?: string;
    route?: string[];
    estimatedDelivery?: Date;
  }) {
    const order = await prisma.order.findUnique({
      where: { uuid: data.orderId },
      include: { user: true },
    });

    if (!order) {
      throw new NotFoundException('Sipariş bulunamadı');
    }

    const trackingNumber = await this.generateTrackingNumber();

    const routeData: ParcelRoute = {
      cities: data.route || ['İstanbul', 'Zonguldak', 'Samsun', 'Ordu', 'Rize'],
      currentCityIndex: 0,
    };

    const parcel = await prisma.parcel.create({
      data: {
        orderId: data.orderId,
        courierId: data.courierId,
        trackingNumber,
        status: ParcelStatus.CREATED,
        shippingAddress: order.shippingAddress,
        route: routeData,
        estimatedDelivery: data.estimatedDelivery,
      },
      include: {
        order: { include: { user: true } },
        courier: true,
      },
    });

    await this.createEvent(parcel.id, {
      eventType: 'STATUS_CHANGE',
      description: 'Kargo oluşturuldu ve işleme alındı',
      location: routeData.cities[0],
      metadata: { status: ParcelStatus.CREATED },
    });

    return parcel;
  }

  static async assignCourier(parcelId: number, courierId: string) {
    const courier = await prisma.user.findUnique({
      where: { id: courierId },
      include: { userRoles: { include: { role: true } } },
    });

    if (!courier || !courier.userRoles.some((ur) => ur.role.name === 'Courier')) {
      throw new BadRequestException('Geçerli bir kurye bulunamadı');
    }

    const parcel = await prisma.parcel.update({
      where: { id: parcelId },
      data: {
        courierId,
        status: ParcelStatus.ASSIGNED,
      },
      include: {
        order: { include: { user: true } },
        courier: true,
      },
    });

    await this.createEvent(parcelId, {
      eventType: 'COURIER_ASSIGNED',
      description: `Kargo ${courier.firstName} ${courier.lastName.charAt(0)}****** kuryesine atandı`,
      courierId,
      metadata: {
        courierName: `${courier.firstName} ${courier.lastName.charAt(0)}******`,
        previousStatus: ParcelStatus.CREATED,
      },
    });

    return parcel;
  }

  static async updateStatus(
    parcelId: number,
    status: ParcelStatus,
    location?: string,
    coordinates?: ParcelCoordinates,
    description?: string,
    courierId?: string,
  ) {
    const parcel = await prisma.parcel.findUnique({
      where: { id: parcelId },
      include: { courier: true },
    });

    if (!parcel) {
      throw new NotFoundException('Kargo bulunamadı');
    }

    const previousStatus = parcel.status as ParcelStatus;

    if (!this.isValidStatusTransition(previousStatus, status)) {
      throw new BadRequestException(
        `${previousStatus} durumundan ${status} durumuna geçiş yapılamaz`,
      );
    }

    const updatedParcel = await prisma.parcel.update({
      where: { id: parcelId },
      data: {
        status,
        ...(status === ParcelStatus.DELIVERED && { actualDelivery: new Date() }),
      },
    });

    let eventDescription = description;
    if (!eventDescription) {
      eventDescription = this.getStatusDescription(status, location, parcel.courier?.firstName);
    }

    await this.createEvent(parcelId, {
      eventType: 'STATUS_CHANGE',
      description: eventDescription,
      location,
      coordinates,
      courierId: courierId || parcel.courierId,
      metadata: {
        previousStatus,
        courierName: parcel.courier
          ? `${parcel.courier.firstName} ${parcel.courier.lastName.charAt(0)}******`
          : undefined,
      },
    });

    if (coordinates && parcel.courierId) {
      await this.updateCourierLocation(parcel.courierId, parcelId, coordinates, location);
    }

    return updatedParcel;
  }

  static async updateCourierLocation(
    courierId: string,
    parcelId: number,
    coordinates: ParcelCoordinates,
    address?: string,
  ) {
    return await prisma.courierLocation.create({
      data: {
        courierId,
        parcelId,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        address,
        city: address?.split(',').pop()?.trim(),
      },
    });
  }

  static async getTrackingInfo(trackingNumber: string) {
    const parcel = await prisma.parcel.findUnique({
      where: { trackingNumber },
      include: {
        events: {
          orderBy: { createdAt: 'asc' },
          include: { courier: true },
        },
        courierLocations: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        order: { include: { user: true } },
        courier: true,
      },
    });

    if (!parcel) {
      throw new NotFoundException('Kargo bulunamadı');
    }

    return {
      parcel: {
        uuid: parcel.uuid,
        trackingNumber: parcel.trackingNumber,
        status: parcel.status,
        estimatedDelivery: parcel.estimatedDelivery,
        actualDelivery: parcel.actualDelivery,
      },
      events: parcel.events.map((event) => ({
        uuid: event.uuid,
        eventType: event.eventType,
        description: event.description,
        location: event.location,
        createdAt: event.createdAt,
      })),
      currentLocation: parcel.courierLocations[0]
        ? {
            latitude: Number(parcel.courierLocations[0].latitude),
            longitude: Number(parcel.courierLocations[0].longitude),
            address: parcel.courierLocations[0].address,
            city: parcel.courierLocations[0].city,
          }
        : null,
    };
  }

  private static async createEvent(
    parcelId: number,
    data: {
      eventType: string;
      description: string;
      location?: string;
      coordinates?: ParcelCoordinates;
      courierId?: string | null;
      metadata?: ParcelEventMetadata;
    },
  ) {
    return await prisma.parcelEvent.create({
      data: {
        parcelId,
        eventType: data.eventType,
        description: data.description,
        location: data.location,
        coordinates: data.coordinates,
        courierId: data.courierId,
        metadata: data.metadata,
      },
    });
  }

  private static async generateTrackingNumber(): Promise<string> {
    const prefix = 'OJS';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  private static isValidStatusTransition(from: ParcelStatus, to: ParcelStatus): boolean {
    const validTransitions: Record<ParcelStatus, ParcelStatus[]> = {
      [ParcelStatus.CREATED]: [ParcelStatus.ASSIGNED, ParcelStatus.CANCELLED],
      [ParcelStatus.ASSIGNED]: [ParcelStatus.PICKED_UP, ParcelStatus.CANCELLED],
      [ParcelStatus.PICKED_UP]: [ParcelStatus.IN_TRANSIT, ParcelStatus.RETURNED],
      [ParcelStatus.IN_TRANSIT]: [ParcelStatus.OUT_FOR_DELIVERY, ParcelStatus.RETURNED],
      [ParcelStatus.OUT_FOR_DELIVERY]: [ParcelStatus.DELIVERED, ParcelStatus.RETURNED],
      [ParcelStatus.DELIVERED]: [],
      [ParcelStatus.CANCELLED]: [],
      [ParcelStatus.RETURNED]: [],
    };

    return validTransitions[from]?.includes(to) || false;
  }

  private static getStatusDescription(
    status: ParcelStatus,
    location?: string,
    courierName?: string,
  ): string {
    const courier = courierName ? `${courierName} ******` : 'Kuryemiz';

    switch (status) {
      case ParcelStatus.ASSIGNED:
        return `Kargo ${courier} kuryesine atandı`;
      case ParcelStatus.PICKED_UP:
        return `${courier} kargo merkezinden paketinizi aldı`;
      case ParcelStatus.IN_TRANSIT:
        return location
          ? `${courier} ${location} şehrine doğru yola çıktı`
          : `${courier} hedefinize doğru yola çıktı`;
      case ParcelStatus.OUT_FOR_DELIVERY:
        return location
          ? `${courier} ${location} şubesine ulaştı ve dağıtıma çıktı`
          : `${courier} dağıtıma çıktı`;
      case ParcelStatus.DELIVERED:
        return 'Paketiniz başarıyla teslim edildi';
      case ParcelStatus.CANCELLED:
        return 'Kargo iptal edildi';
      case ParcelStatus.RETURNED:
        return 'Kargo gönderene iade edildi';
      default:
        return 'Kargo durumu güncellendi';
    }
  }
}
