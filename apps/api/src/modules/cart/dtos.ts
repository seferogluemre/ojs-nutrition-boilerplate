import { CartPlain } from '#prismabox/Cart';
import { CartItemPlain } from '#prismabox/CartItem';
import { ProductPlain } from '#prismabox/Product';
import { ProductVariantPlain } from '#prismabox/ProductVariant';
import { t } from 'elysia';
import { headers } from '../../utils';
import { errorResponseDto } from '../../utils/common-dtos';
import { type ControllerHook } from '../../utils/elysia-types';

const formattedCartItemSchema = t.Object({
  id: CartItemPlain.properties.uuid,
  quantity: CartItemPlain.properties.quantity,
  product: t.Object({
    id: ProductPlain.properties.uuid,
    name: ProductPlain.properties.name,
    slug: ProductPlain.properties.slug,
    price: ProductPlain.properties.price,
    primary_photo_url: ProductPlain.properties.primaryPhotoUrl,
  }),
  variant: t.Object({
    id: ProductVariantPlain.properties.uuid,
    name: ProductVariantPlain.properties.name,
  }),
});

const cartResponseSchema = t.Object({
  id: CartPlain.properties.uuid,
  items: t.Array(formattedCartItemSchema),
  summary: t.Object({
    total_items: t.Number(),
    total_quantity: t.Number(),
    subtotal: t.Number(),
  }),
  updated_at: t.Date(),
});

// GET /cart
export const getCartDto = {
  headers: headers,
  response: {
    200: cartResponseSchema,
  },
  detail: {
    summary: "Get the customer's cart",
    description: "Retrieves all items in the authenticated customer's cart.",
  },
} satisfies ControllerHook;

// POST /cart
export const addToCartDto = {
  headers: headers,
  body: t.Object({
    product_id: t.String({
      format: 'uuid',
      error: 'product_id geçerli bir UUID olmalıdır.',
    }),
    product_variant_id: t.String({
      format: 'uuid',
      error: 'product_variant_id geçerli bir UUID olmalıdır.',
    }),
    quantity: t.Number({
      minimum: 1,
      error: 'Adet (pieces) en az 1 olmalıdır.',
    }),
  }),
  response: {
    201: cartResponseSchema,
    400: errorResponseDto[400],
    404: errorResponseDto[404],
  },
  detail: {
    summary: 'Add an item to the cart',
    description:
      'Adds a product to the cart. If the item already exists, the quantity is increased.',
  },
} satisfies ControllerHook;

// DELETE /cart/items/:item_uuid
export const deleteFromCartDto = {
  headers: headers,
  params: t.Object({
    item_uuid: t.String({
      format: 'uuid',
      error: 'item_uuid geçerli bir UUID olmalıdır.',
    }),
  }),
  response: {
    200: cartResponseSchema,
    404: errorResponseDto[404],
  },
  detail: {
    summary: 'Remove an item from the cart',
    description: "Removes a specific item from the cart using the item's UUID.",
  },
} satisfies ControllerHook;
