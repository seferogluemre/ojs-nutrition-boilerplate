import type { CourierLocation, Order, Parcel, ParcelEvent, User } from '@prisma/client';

type ParcelWithRelations = Parcel & {
  courier?: User | null;
  order?: (Order & {
    user?: User;
  }) | null;
  events?: ParcelEvent[];
  courierLocations?: CourierLocation[];
};

export class ParcelFormatter {
  static response(parcel: ParcelWithRelations) {
    return {
      uuid: parcel.uuid,
      trackingNumber: parcel.trackingNumber,
      status: parcel.status,
      orderId: parcel.orderId,
      courier: parcel.courier ? {
        id: parcel.courier.id,
        firstName: parcel.courier.firstName,
        lastName: parcel.courier.lastName,
      } : null,
      shippingAddress: parcel.shippingAddress,
      route: parcel.route,
      estimatedDelivery: parcel.estimatedDelivery?.toISOString(),
      actualDelivery: parcel.actualDelivery?.toISOString(),
      events: parcel.events?.map(event => ({
        uuid: event.uuid,
        eventType: event.eventType,
        description: event.description,
        location: event.location,
        createdAt: event.createdAt.toISOString(),
      })) || [],
      createdAt: parcel.createdAt.toISOString(),
      updatedAt: parcel.updatedAt.toISOString(),
    };
  }

  static listResponse(parcel: ParcelWithRelations) {
    return {
      uuid: parcel.uuid,
      trackingNumber: parcel.trackingNumber,
      status: parcel.status,
      orderId: parcel.orderId,
      courier: parcel.courier ? {
        id: parcel.courier.id,
        firstName: parcel.courier.firstName,
        lastName: parcel.courier.lastName,
      } : null,
      estimatedDelivery: parcel.estimatedDelivery?.toISOString(),
      createdAt: parcel.createdAt.toISOString(),
    };
  }

  static courierAssignedResponse(parcel: ParcelWithRelations) {
    return {
      uuid: parcel.uuid,
      trackingNumber: parcel.trackingNumber,
      status: parcel.status,
      order: parcel.order ? {
        uuid: parcel.order.uuid,
        orderNumber: parcel.order.orderNumber,
        user: parcel.order.user ? {
          firstName: parcel.order.user.firstName,
          lastName: parcel.order.user.lastName,
        } : null,
      } : null,
      shippingAddress: parcel.shippingAddress,
      estimatedDelivery: parcel.estimatedDelivery?.toISOString(),
      createdAt: parcel.createdAt.toISOString(),
    };
  }

  static trackingResponse(data: {
    parcel: ParcelWithRelations;
    events: ParcelEvent[];
    currentLocation?: CourierLocation | null;
  }) {
    return {
      parcel: {
        uuid: data.parcel.uuid,
        trackingNumber: data.parcel.trackingNumber,
        status: data.parcel.status,
        estimatedDelivery: data.parcel.estimatedDelivery?.toISOString(),
        actualDelivery: data.parcel.actualDelivery?.toISOString(),
      },
      events: data.events.map(event => ({
        uuid: event.uuid,
        eventType: event.eventType,
        description: event.description,
        location: event.location,
        createdAt: event.createdAt.toISOString(),
      })),
      currentLocation: data.currentLocation ? {
        latitude: Number(data.currentLocation.latitude),
        longitude: Number(data.currentLocation.longitude),
        address: data.currentLocation.address,
        city: data.currentLocation.city,
      } : null,
    };
  }

  static locationResponse(location: CourierLocation) {
    return {
      uuid: location.uuid,
      latitude: Number(location.latitude),
      longitude: Number(location.longitude),
      address: location.address,
      city: location.city,
    };
  }
}
