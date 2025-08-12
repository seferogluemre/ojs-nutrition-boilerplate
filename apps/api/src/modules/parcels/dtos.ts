import { t } from 'elysia';

// ===== Base Schemas =====
const parcelStatusEnum = t.Union([
  t.Literal('CREATED'),
  t.Literal('ASSIGNED'),
  t.Literal('PICKED_UP'),
  t.Literal('IN_TRANSIT'),
  t.Literal('OUT_FOR_DELIVERY'),
  t.Literal('DELIVERED'),
  t.Literal('CANCELLED'),
  t.Literal('RETURNED'),
]);

const coordinatesSchema = t.Object({
  lat: t.Number(),
  lng: t.Number(),
});

const courierSchema = t.Object({
  id: t.String(),
  firstName: t.String(),
  lastName: t.String(),
});

const parcelEventSchema = t.Object({
  uuid: t.String(),
  eventType: t.String(),
  description: t.String(),
  location: t.Optional(t.String()),
  createdAt: t.String(),
});

const paginationMetaSchema = t.Object({
  total: t.Number(),
  page: t.Number(),
  limit: t.Number(),
  totalPages: t.Number(),
});

// ===== Endpoint DTOs =====

// GET /parcels
export const parcelIndexDto = {
  query: t.Object({
    page: t.Optional(t.Numeric()),
    limit: t.Optional(t.Numeric()),
    status: t.Optional(t.String()),
    courierId: t.Optional(t.String()),
    search: t.Optional(t.String()),
  }),
  response: t.Object({
    data: t.Array(t.Object({
      uuid: t.String(),
      trackingNumber: t.String(),
      status: t.String(),
      orderId: t.String(),
      courier: t.Optional(courierSchema),
      estimatedDelivery: t.Optional(t.String()),
      createdAt: t.String(),
    })),
    meta: paginationMetaSchema,
  }),
};

// GET /parcels/:uuid
export const parcelShowDto = {
  params: t.Object({
    uuid: t.String(),
  }),
  response: t.Object({
    uuid: t.String(),
    trackingNumber: t.String(),
    status: t.String(),
    orderId: t.String(),
    courier: t.Optional(courierSchema),
    shippingAddress: t.Any(),
    route: t.Optional(t.Any()),
    estimatedDelivery: t.Optional(t.String()),
    actualDelivery: t.Optional(t.String()),
    events: t.Array(parcelEventSchema),
    createdAt: t.String(),
    updatedAt: t.String(),
  }),
};

// POST /parcels
export const parcelCreateDto = {
  body: t.Object({
    orderId: t.String(),
    courierId: t.Optional(t.String()),
    route: t.Optional(t.Array(t.String())),
    estimatedDelivery: t.Optional(t.String()),
  }),
  response: t.Object({
    uuid: t.String(),
    trackingNumber: t.String(),
    status: t.String(),
    orderId: t.String(),
    courier: t.Optional(courierSchema),
    createdAt: t.String(),
  }),
};

// PATCH /parcels/:id/assign-courier
export const parcelAssignCourierDto = {
  params: t.Object({
    id: t.Numeric(),
  }),
  body: t.Object({
    courierId: t.String(),
  }),
  response: t.Object({
    uuid: t.String(),
    trackingNumber: t.String(),
    status: t.String(),
    courier: courierSchema,
    message: t.String(),
  }),
};

// PATCH /parcels/:id/status
export const parcelStatusUpdateDto = {
  params: t.Object({
    id: t.String(),
  }),
  body: t.Object({
    status: parcelStatusEnum,
    location: t.Optional(t.String()),
    coordinates: t.Optional(coordinatesSchema),
    description: t.Optional(t.String()),
  }),
  response: t.Object({
    uuid: t.String(),
    status: t.String(),
    message: t.String(),
  }),
};

// GET /parcels/track/:trackingNumber (Public)
export const parcelTrackDto = {
  params: t.Object({
    trackingNumber: t.String(),
  }),
  response: t.Object({
    success: t.Boolean(),
    data: t.Object({
      parcel: t.Object({
        uuid: t.String(),
        trackingNumber: t.String(),
        status: t.String(),
        estimatedDelivery: t.Optional(t.String()),
        actualDelivery: t.Optional(t.String()),
      }),
      events: t.Array(parcelEventSchema),
      currentLocation: t.Optional(t.Object({
        latitude: t.Number(),
        longitude: t.Number(),
        address: t.Optional(t.String()),
        city: t.Optional(t.String()),
      })),
    }),
  }),
};

// GET /parcels/courier/assigned
export const parcelCourierAssignedDto = {
  query: t.Object({
    status: t.Optional(t.String()),
    page: t.Optional(t.Numeric()),
    limit: t.Optional(t.Numeric()),
  }),
  response: t.Object({
    data: t.Array(t.Object({
      uuid: t.String(),
      trackingNumber: t.String(),
      status: t.String(),
      order: t.Object({
        uuid: t.String(),
        orderNumber: t.String(),
        user: t.Object({
          firstName: t.String(),
          lastName: t.String(),
        }),
      }),
      shippingAddress: t.Any(),
      estimatedDelivery: t.Optional(t.String()),
      createdAt: t.String(),
    })),
    meta: paginationMetaSchema,
  }),
};

// POST /parcels/:id/location
export const parcelLocationUpdateDto = {
  params: t.Object({
    id: t.String(),
  }),
  body: t.Object({
    coordinates: coordinatesSchema,
    address: t.Optional(t.String()),
  }),
  response: t.Object({
    success: t.Boolean(),
    data: t.Object({
      uuid: t.String(),
      latitude: t.Number(),
      longitude: t.Number(),
      address: t.Optional(t.String()),
      city: t.Optional(t.String()),
    }),
    message: t.String(),
  }),
};

// PUT /parcels/:uuid
export const parcelUpdateDto = {
  params: t.Object({
    uuid: t.String(),
  }),
  body: t.Object({
    courierId: t.Optional(t.String()),
    status: t.Optional(parcelStatusEnum),
    route: t.Optional(t.Array(t.String())),
    estimatedDelivery: t.Optional(t.String()),
  }),
  response: t.Object({
    uuid: t.String(),
    trackingNumber: t.String(),
    status: t.String(),
    courier: t.Optional(courierSchema),
    message: t.String(),
  }),
};

// DELETE /parcels/:uuid
export const parcelDestroyDto = {
  params: t.Object({
    uuid: t.String(),
  }),
  response: t.Object({
    message: t.String(),
  }),
};
