import { t } from 'elysia';

export const parcelCreateDto = t.Object({
  orderId: t.String(),
  courierId: t.Optional(t.String()),
  route: t.Optional(t.Array(t.String())),
  estimatedDelivery: t.Optional(t.String()),
});

export const parcelUpdateDto = t.Object({
  courierId: t.Optional(t.String()),
  status: t.Optional(
    t.Union([
      t.Literal('CREATED'),
      t.Literal('ASSIGNED'),
      t.Literal('PICKED_UP'),
      t.Literal('IN_TRANSIT'),
      t.Literal('OUT_FOR_DELIVERY'),
      t.Literal('DELIVERED'),
      t.Literal('CANCELLED'),
      t.Literal('RETURNED'),
    ]),
  ),
  route: t.Optional(t.Array(t.String())),
  estimatedDelivery: t.Optional(t.String()),
});

export const parcelStatusUpdateDto = t.Object({
  status: t.Union([
    t.Literal('CREATED'),
    t.Literal('ASSIGNED'),
    t.Literal('PICKED_UP'),
    t.Literal('IN_TRANSIT'),
    t.Literal('OUT_FOR_DELIVERY'),
    t.Literal('DELIVERED'),
    t.Literal('CANCELLED'),
    t.Literal('RETURNED'),
  ]),
  location: t.Optional(t.String()),
  coordinates: t.Optional(
    t.Object({
      lat: t.Number(),
      lng: t.Number(),
    }),
  ),
  description: t.Optional(t.String()),
});

export const parcelTrackingResponseDto = t.Object({
  parcel: t.Object({
    uuid: t.String(),
    trackingNumber: t.String(),
    status: t.String(),
    estimatedDelivery: t.Optional(t.String()),
    actualDelivery: t.Optional(t.String()),
  }),
  events: t.Array(
    t.Object({
      uuid: t.String(),
      eventType: t.String(),
      description: t.String(),
      location: t.Optional(t.String()),
      createdAt: t.String(),
    }),
  ),
  currentLocation: t.Optional(
    t.Object({
      latitude: t.Number(),
      longitude: t.Number(),
      address: t.Optional(t.String()),
      city: t.Optional(t.String()),
    }),
  ),
});