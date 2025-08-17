import { prisma } from '#core';
import { BadRequestException, NotFoundException } from '../../utils';
import { RouteOptimizationService } from './route-optimization';
import { ParcelStatus, type CourierAssignedQuery, type ParcelCoordinates, type ParcelEventMetadata, type ParcelIndexQuery, type ParcelRoute } from './types';

export class ParcelService {
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

  static async create(data: {
    orderId: string;
    courierId?: string;
    route?: string[];
    estimatedDelivery?: Date;
  }) {
    const order = await prisma.order.findUnique({
      where: { uuid: data.orderId },
      include: { user: true }
    });

    if (!order) {
      throw new NotFoundException('Sipariş bulunamadı');
    }

    const existingParcel = await prisma.parcel.findUnique({
      where: { orderId: data.orderId }
    });

    if (existingParcel) {
      throw new BadRequestException('Bu sipariş için zaten kargo oluşturulmuş');
    }

    const trackingNumber = await this.generateTrackingNumber();

    let routeData: any;
    
    if (data.route && data.route.length > 0 && data.route[0] !== '') {
      routeData = {
        cities: data.route,
        currentCityIndex: 0,
        isOptimized: false,
      };
    } else {
      const destinationCity = RouteOptimizationService.extractCityFromAddress(order.shippingAddress);
      const cities = destinationCity ? [destinationCity] : [];
      
      const optimizedRoute = RouteOptimizationService.generateOptimalRoute(cities);
      routeData = {
        ...optimizedRoute,
        currentCityIndex: 0,
      };
      
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

    await this.createEvent(parcel.id, {
      eventType: 'STATUS_CHANGE',
      description: 'Kargo oluşturuldu ve işleme alındı',
      location: routeData.cities[0],
      metadata: { status: ParcelStatus.CREATED }
    });

    return parcel;
  }

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

  static async assignCourier(parcelId: number, courierId: string) {
    const courier = await prisma.user.findUnique({
      where: { id: courierId }, 
      
    });

    if (!courier) {
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

    try {
      await this.syncOrderStatus(parcelId, ParcelStatus.ASSIGNED);
    } catch (syncError) {
      console.error(`⚠️ Order sync failed for parcel ${parcelId}:`, syncError);
      // Senkronizasyon hatası kurye atamasını engellemez
    }

    return parcel;
  }

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

    // Order status senkronizasyonu
    try {
      await this.syncOrderStatus(parcelId, status);
    } catch (syncError) {
      console.error(`⚠️ Order sync failed for parcel ${parcelId}:`, syncError);
      // Senkronizasyon hatası parcel güncellemeyi engellemez
    }

    return updatedParcel;
  }

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

  static async updateCourierParcelsRoute(courierId: string) {
    try {
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

      const optimizedRoute = RouteOptimizationService.generateOptimalRoute(destinationCities);
      
      console.log(`🗺️ Kurye ${courierId} için yeni rota oluşturuldu:`, {
        cities: optimizedRoute.cities,
        totalDistance: optimizedRoute.totalDistance,
        estimatedDuration: optimizedRoute.estimatedDuration
      });

      const updatePromises = activeParcels.map(parcel => 
        prisma.parcel.update({
          where: { id: parcel.id },
          data: {
            route: {
              ...optimizedRoute,
              currentCityIndex: 0, 
            }
          }
        })
      );

      await Promise.all(updatePromises);

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
    }
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

  static async syncOrderStatus(parcelId: number, parcelStatus: ParcelStatus) {
    try {
      const parcel = await prisma.parcel.findUnique({
        where: { id: parcelId },
        include: { order: true }
      });

      if (!parcel || !parcel.order) {
        console.log(`⚠️ Parcel ${parcelId} or associated order not found for status sync`);
        return;
      }

      // Parcel status → Order status mapping
      let orderStatus: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | null = null;

      switch (parcelStatus) {
        case ParcelStatus.CREATED:
        case ParcelStatus.ASSIGNED:
          orderStatus = 'CONFIRMED';
          break;
        case ParcelStatus.PICKED_UP:
        case ParcelStatus.IN_TRANSIT:
          orderStatus = 'PREPARING';
          break;
        case ParcelStatus.OUT_FOR_DELIVERY:
          orderStatus = 'SHIPPED';
          break;
        case ParcelStatus.DELIVERED:
          orderStatus = 'DELIVERED';
          break;
        case ParcelStatus.CANCELLED:
        case ParcelStatus.RETURNED:
          orderStatus = 'CANCELLED';
          break;
        default:
          console.log(`⚠️ No order status mapping for parcel status: ${parcelStatus}`);
          return;
      }

      // Order status güncelle (sadece gerekirse)
      if (orderStatus && parcel.order.status !== orderStatus) {
        const { OrderService } = await import('../orders/service');
        await OrderService.updateOrderStatus(parcel.order.uuid, orderStatus);
        console.log(`🔄 Order ${parcel.order.orderNumber} status synced: ${parcel.order.status} → ${orderStatus}`);
      }

    } catch (error) {
      console.error(`❌ Failed to sync order status for parcel ${parcelId}:`, error);
      // Senkronizasyon hatası diğer işlemleri engellemez
    }
  }
}
