import type { CartService } from './service';

type CartPayload = Awaited<ReturnType<typeof CartService.create>>;

type CartItemPayload = CartPayload['items'][0];
export abstract class CartFormatter {
  
  static formatItem(cartItem: CartItemPayload) {
    return {
      id: cartItem.uuid,
      quantity: cartItem.quantity,
      product: {
        id: cartItem.product.uuid,
        name: cartItem.product.name,
        slug: cartItem.product.slug,
        price: cartItem.product.price,
        primary_photo_url: cartItem.product.primaryPhotoUrl,
      },
      variant: {
        id: cartItem.productVariant.uuid,
        name: cartItem.productVariant.name,
      },
      added_at: cartItem.createdAt,
    };
  }

  static format(cart: CartPayload) {
    const subtotal = cart.items.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);

    return {
      id: cart.uuid,
      items: cart.items.map(CartFormatter.formatItem),
      summary: {
        total_items: cart.items.length,
        total_quantity: cart.items.reduce((acc, item) => acc + item.quantity, 0),
        subtotal: subtotal,
      },
      updated_at: cart.updatedAt,
    };
  }
}
