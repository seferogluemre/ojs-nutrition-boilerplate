import { OrderPlain } from '#prismabox/Order';
import { OrderItemPlain } from '#prismabox/OrderItem';
import { ProductPlain } from '#prismabox/Product';
import { t } from 'elysia';
import { headers } from '../../utils';
import { errorResponseDto } from '../../utils/common-dtos';
import { type ControllerHook } from '../../utils/elysia-types';

const formattedOrderItemSchema = t.Object({
  id: OrderItemPlain.properties.uuid,
  quantity: OrderItemPlain.properties.quantity,
  unitPrice: OrderItemPlain.properties.unitPrice,
  totalPrice: OrderItemPlain.properties.totalPrice,
  product: t.Object({
    id: ProductPlain.properties.uuid,
    name: ProductPlain.properties.name,
    slug: ProductPlain.properties.slug,
    price: ProductPlain.properties.price,
    primary_photo_url: ProductPlain.properties.primaryPhotoUrl,
  }),
});

const orderResponseSchema = t.Object({
  id: OrderPlain.properties.uuid,
  orderNumber: OrderPlain.properties.orderNumber,
  status: OrderPlain.properties.status,
  subtotal: OrderPlain.properties.subtotal,
  shippingAddress: t.Object({
    title: t.String(),
    recipientName: t.String(),
    phone: t.String(),
    addressLine1: t.String(),
    addressLine2: t.Optional(t.Union([t.String(), t.Null()])),
    postalCode: t.String(),
    city: t.String(),
    state: t.String(),
    country: t.String(),
  }),
  items: t.Array(formattedOrderItemSchema),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

const orderListItemSchema = t.Object({
  id: OrderPlain.properties.uuid,
  orderNumber: OrderPlain.properties.orderNumber,
  status: OrderPlain.properties.status,
  subtotal: OrderPlain.properties.subtotal,
  itemCount: t.Number(),
  createdAt: t.Date(),
});

// GET /orders
export const getOrdersDto = {
  headers: headers,
  response: {
    200: t.Array(orderListItemSchema),
  },
  detail: {
    summary: "Get user's orders",
    description: "Retrieves all orders for the authenticated user.",
  },
} satisfies ControllerHook;

// GET /orders/:id
export const getOrderDetailDto = {
  headers: headers,
  params: t.Object({
    id: t.String({
      format: 'uuid',
      error: 'id geçerli bir UUID olmalıdır.',
    }),
  }),
  response: {
    200: orderResponseSchema,
    404: errorResponseDto[404],
  },
  detail: {
    summary: 'Get order details',
    description: "Retrieves detailed information about a specific order.",
  },
} satisfies ControllerHook;

// POST /orders/complete-shopping
export const completeShoppingDto = {
  headers: headers,
  body: t.Object({
    address_id: t.Optional(t.String({
      format: 'uuid',
      error: 'address_id geçerli bir UUID olmalıdır.',
    })),
    payment_type: t.String({
      minLength: 1,
      error: 'payment_type gereklidir.',
    }),
    card_digits: t.String({
      minLength: 16,
      maxLength: 16,
      error: 'card_digits 16 karakter olmalıdır.',
    }),
    card_expiration_date: t.String({
      pattern: '^(0[1-9]|1[0-2])-[0-9]{2}$',
      error: 'card_expiration_date MM-YY formatında olmalıdır.',
    }),
    card_security_code: t.String({
      minLength: 3,
      maxLength: 4,
      error: 'card_security_code 3 veya 4 karakter olmalıdır.',
    }),
    card_type: t.String({
      minLength: 1,
      error: 'card_type gereklidir.',
    }),
  }),
  response: {
    201: orderResponseSchema,
    400: errorResponseDto[400],
    404: errorResponseDto[404],
  },
  detail: {
    summary: 'Complete shopping and create order',
    description: 'Creates an order from the user\'s cart and processes payment information.',
  },
} satisfies ControllerHook; 