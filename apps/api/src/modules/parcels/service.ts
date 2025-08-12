import { prisma } from '#core';
import { BadRequestException, NotFoundException } from '../../utils';
import { RouteOptimizationService } from './route-optimization';
import { ParcelStatus, type CourierAssignedQuery, type ParcelCoordinates, type ParcelEventMetadata, type ParcelIndexQuery, type ParcelRoute } from './types';

export class ParcelService {
  // Kargo listesi (Admin/Courier)
  static async index(query: ParcelIndexQuery) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.courierId) {
      where.courierId = query.courierId;
    }

    if (query.search) {
      where.OR = [
        { trackingNumber: { contains: query.search, mode: 'insensitive' } },
        { order: { orderNumber: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    where.deletedAt = null;

    const [parcels, total] = await Promise.all([
      prisma.parcel.findMany({
        where,
        include: {
          courier: true,
          order: {
            include: { user: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.parcel.count({ where }),
    ]);

    return {
      data: parcels,
      total,
    };
  }

  // Kargo detayını getir
  static async show(uuid: string) {
    const parcel = await prisma.parcel.findUnique({
      where: { uuid, deletedAt: null },
      include: {
        courier: true,
        order: {
          include: { user: true }
        },
        events: {
          orderBy: { createdAt: 'asc' },
          include: { courier: true }
        },
        courierLocations: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        }
      }
    });

    if (!parcel) {
      throw new NotFoundException('Kargo bulunamadı');
    }

    return parcel;
  }

  // Kargo oluştur (sipariş verildiğinde otomatik çağrılır)
  static async create(data: {
    orderId: string;
    courierId?: string;
    route?: string[];
    estimatedDelivery?: Date;
  }) {
    // Order'ı kontrol et
    const order = await prisma.order.findUnique({
      where: { uuid: data.orderId },
      include: { user: true }
    });

    if (!order) {
      throw new NotFoundException('Sipariş bulunamadı');
    }

    // Mevcut kargo var mı kontrol et
    const existingParcel = await prisma.parcel.findUnique({
      where: { orderId: data.orderId }
    });

    if (existingParcel) {
      throw new BadRequestException('Bu sipariş için zaten kargo oluşturulmuş');
    }

    // Tracking number oluştur
    const trackingNumber = await this.generateTrackingNumber();

    // Route bilgisini hazırla - otomatik optimizasyon
    let routeData: any;
    
    if (data.route && data.route.length > 0 && data.route[0] !== '') {
      // Manuel route verilmişse kullan
      routeData = {
        cities: data.route,
        currentCityIndex: 0,
        isOptimized: false,
      };
    } else {
      // Otomatik route oluştur - sadece bu siparişin şehri
      const destinationCity = RouteOptimizationService.extractCityFromAddress(order.shippingAddress);
      const cities = destinationCity ? [destinationCity] : [];
      
      const optimizedRoute = RouteOptimizationService.generateOptimalRoute(cities);
      routeData = {
        ...optimizedRoute,
        currentCityIndex: 0,
      };
      
      console.log(`📍 Auto-generated route for order ${order.orderNumber}:`, optimizedRoute.cities);
    }

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
      }
    });

    // İlk event'i oluştur
    await this.createEvent(parcel.id, {
      eventType: 'STATUS_CHANGE',
      description: 'Kargo oluşturuldu ve işleme alındı',
      location: routeData.cities[0],
      metadata: { status: ParcelStatus.CREATED }
    });

    return parcel;
  }

  // Kargo güncelle
  static async update(uuid: string, data: {
    courierId?: string;
    status?: ParcelStatus;
    route?: string[];
    estimatedDelivery?: Date;
  }) {
    const parcel = await prisma.parcel.findUnique({
      where: { uuid, deletedAt: null },
      include: { courier: true }
    });

    if (!parcel) {
      throw new NotFoundException('Kargo bulunamadı');
    }

    const updateData: any = {};

    if (data.courierId !== undefined) {
      updateData.courierId = data.courierId;
    }

    if (data.status !== undefined) {
      // Status transition kontrolü
      if (!this.isValidStatusTransition(parcel.status as ParcelStatus, data.status)) {
        throw new BadRequestException(`${parcel.status} durumundan ${data.status} durumuna geçiş yapılamaz`);
      }
      updateData.status = data.status;
    }

    if (data.route !== undefined) {
      const routeData: ParcelRoute = {
        cities: data.route,
        currentCityIndex: (parcel.route as any)?.currentCityIndex || 0,
      };
      updateData.route = routeData;
    }

    if (data.estimatedDelivery !== undefined) {
      updateData.estimatedDelivery = data.estimatedDelivery;
    }

    const updatedParcel = await prisma.parcel.update({
      where: { uuid },
      data: updateData,
      include: {
        courier: true,
        order: { include: { user: true } }
      }
    });

    // Status değişikliği varsa event oluştur
    if (data.status && data.status !== parcel.status) {
      await this.createEvent(updatedParcel.id, {
        eventType: 'STATUS_CHANGE',
        description: this.getStatusDescription(data.status),
        metadata: { 
          previousStatus: parcel.status,
          updatedManually: true 
        }
      });
    }

    return updatedParcel;
  }

  // Kuryeye ata
  static async assignCourier(parcelId: number, courierId: string) {
    const courier = await prisma.user.findUnique({
      where: { id: courierId },
      include: { userRoles: { include: { role: true } } }
    });

    if (!courier || !courier.userRoles.some(ur => ur.role.name === 'Courier')) {
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
      }
    });

    // Event oluştur
    await this.createEvent(parcelId, {
      eventType: 'COURIER_ASSIGNED',
      description: `Kargo ${courier.firstName} ${courier.lastName.charAt(0)}****** kuryesine atandı`,
      courierId,
      metadata: { 
        courierName: `${courier.firstName} ${courier.lastName.charAt(0)}******`,
        previousStatus: ParcelStatus.CREATED 
      }
    });

    // Kuryenin tüm kargolarının rotasını yeniden hesapla
    await this.updateCourierParcelsRoute(courierId);

    return parcel;
  }

  // Status güncelle
  static async updateStatus(
    parcelId: number, 
    status: ParcelStatus, 
    location?: string,
    coordinates?: ParcelCoordinates,
    description?: string,
    courierId?: string
  ) {
    const parcel = await prisma.parcel.findUnique({
      where: { id: parcelId },
      include: { courier: true }
    });

    if (!parcel) {
      throw new NotFoundException('Kargo bulunamadı');
    }

    const previousStatus = parcel.status as ParcelStatus;

    if (!this.isValidStatusTransition(previousStatus, status)) {
      throw new BadRequestException(`${previousStatus} durumundan ${status} durumuna geçiş yapılamaz`);
    }

    // Parcel'ı güncelle
    const updatedParcel = await prisma.parcel.update({
      where: { id: parcelId },
      data: {
        status,
        ...(status === ParcelStatus.DELIVERED && { actualDelivery: new Date() }),
      },
    });

    // Event oluştur
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
        courierName: parcel.courier ? `${parcel.courier.firstName} ${parcel.courier.lastName.charAt(0)}******` : undefined 
      }
    });

    // Konum güncelle (eğer kurye koordinat gönderiyorsa)
    if (coordinates && parcel.courierId) {
      await this.updateCourierLocation(parcel.courierId, parcelId, coordinates, location);
    }

    return updatedParcel;
  }

  // Kurye konumunu güncelle
  static async updateCourierLocation(
    courierId: string,
    parcelId: number,
    coordinates: ParcelCoordinates,
    address?: string
  ) {
    return await prisma.courierLocation.create({
      data: {
        courierId,
        parcelId,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        address,
        city: address?.split(',').pop()?.trim(),
      }
    });
  }

  // Tracking bilgilerini getir
  static async getTrackingInfo(trackingNumber: string) {
    const parcel = await prisma.parcel.findUnique({
      where: { trackingNumber },
      include: {
        events: {
          orderBy: { createdAt: 'asc' },
          include: { courier: true }
        },
        courierLocations: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        order: { include: { user: true } },
        courier: true,
      }
    });

    if (!parcel) {
      throw new NotFoundException('Kargo bulunamadı');
    }

    return {
      parcel,
      events: parcel.events,
      currentLocation: parcel.courierLocations[0] || null,
    };
  }

  // Kuryenin atanan kargolarını getir
  static async getCourierAssignedParcels(courierId: string, query: CourierAssignedQuery) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      courierId,
      deletedAt: null,
    };

    if (query.status) {
      where.status = query.status;
    }

    const [parcels, total] = await Promise.all([
      prisma.parcel.findMany({
        where,
        include: {
          order: {
            include: { user: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.parcel.count({ where }),
    ]);

    return {
      data: parcels,
      total,
    };
  }

  // Kargo sil (soft delete)
  static async destroy(uuid: string) {
    const parcel = await prisma.parcel.findUnique({
      where: { uuid, deletedAt: null }
    });

    if (!parcel) {
      throw new NotFoundException('Kargo bulunamadı');
    }

    // Teslim edilmiş kargoları silemez
    if (parcel.status === ParcelStatus.DELIVERED) {
      throw new BadRequestException('Teslim edilmiş kargo silinemez');
    }

    return await prisma.parcel.update({
      where: { uuid },
      data: { deletedAt: new Date() }
    });
  }

  // Kuryenin tüm aktif kargolarının rotasını yeniden hesapla
  static async updateCourierParcelsRoute(courierId: string) {
    try {
      // Kuryenin aktif kargolarını al
      const activeParcels = await prisma.parcel.findMany({
        where: {
          courierId,
          status: {
            in: [ParcelStatus.ASSIGNED, ParcelStatus.PICKED_UP, ParcelStatus.IN_TRANSIT, ParcelStatus.OUT_FOR_DELIVERY]
          },
          deletedAt: null
        },
        include: {
          order: true
        }
      });

      if (activeParcels.length === 0) {
        console.log(`ℹ️ Kurye ${courierId} için aktif kargo bulunamadı`);
        return;
      }

      // Teslimat şehirlerini topla
      const destinationCities: string[] = [];
      
      for (const parcel of activeParcels) {
        const city = RouteOptimizationService.extractCityFromAddress(parcel.order.shippingAddress);
        if (city && !destinationCities.includes(city)) {
          destinationCities.push(city);
        }
      }

      if (destinationCities.length === 0) {
        console.log(`⚠️ Kurye ${courierId} için teslimat şehri bulunamadı`);
        return;
      }

      // Optimal rota oluştur
      const optimizedRoute = RouteOptimizationService.generateOptimalRoute(destinationCities);
      
      console.log(`🗺️ Kurye ${courierId} için yeni rota oluşturuldu:`, {
        cities: optimizedRoute.cities,
        totalDistance: optimizedRoute.totalDistance,
        estimatedDuration: optimizedRoute.estimatedDuration
      });

      // Tüm aktif kargoların rotasını güncelle
      const updatePromises = activeParcels.map(parcel => 
        prisma.parcel.update({
          where: { id: parcel.id },
          data: {
            route: {
              ...optimizedRoute,
              currentCityIndex: 0, // Yeniden başla
            }
          }
        })
      );

      await Promise.all(updatePromises);

      // Log event'i oluştur
      const eventPromises = activeParcels.map(parcel =>
        this.createEvent(parcel.id, {
          eventType: 'ROUTE_OPTIMIZED',
          description: `Rota güncellendi: ${optimizedRoute.cities.join(' → ')}`,
          courierId,
          metadata: {
            oldRoute: (parcel.route as any)?.cities || [],
            newRoute: optimizedRoute.cities,
            optimization: {
              totalDistance: optimizedRoute.totalDistance,
              estimatedDuration: optimizedRoute.estimatedDuration,
              isOptimized: true
            }
          }
        })
      );

      await Promise.all(eventPromises);

      console.log(`✅ ${activeParcels.length} kargo için rota güncellendi`);

    } catch (error) {
      console.error('❌ Kurye kargoları rota güncelleme hatası:', error);
      // Hata kullanıcıyı etkilemesin, sadece log
    }
  }

  // Event oluştur
  private static async createEvent(
    parcelId: number,
    data: {
      eventType: string;
      description: string;
      location?: string;
      coordinates?: ParcelCoordinates;
      courierId?: string | null;
      metadata?: ParcelEventMetadata;
    }
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
      }
    });
  }

  // Tracking number oluştur
  private static async generateTrackingNumber(): Promise<string> {
    let trackingNumber: string;
    let isUnique = false;

    do {
      const prefix = 'OJS';
      const timestamp = Date.now().toString().slice(-8);
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      trackingNumber = `${prefix}${timestamp}${random}`;

      const existing = await prisma.parcel.findUnique({
        where: { trackingNumber }
      });

      isUnique = !existing;
    } while (!isUnique);

    return trackingNumber;
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

  // Status açıklaması oluştur
  private static getStatusDescription(
    status: ParcelStatus, 
    location?: string, 
    courierName?: string
  ): string {
    const courier = courierName ? `${courierName} ******` : 'Kuryemiz';
    
    switch (status) {
      case ParcelStatus.ASSIGNED:
        return `Kargo ${courier} kuryesine atandı`;
      case ParcelStatus.PICKED_UP:
        return `${courier} kargo merkezinden paketinizi aldı`;
      case ParcelStatus.IN_TRANSIT:
        return location ? `${courier} ${location} şehrine doğru yola çıktı` : `${courier} hedefinize doğru yola çıktı`;
      case ParcelStatus.OUT_FOR_DELIVERY:
        return location ? `${courier} ${location} şubesine ulaştı ve dağıtıma çıktı` : `${courier} dağıtıma çıktı`;
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
