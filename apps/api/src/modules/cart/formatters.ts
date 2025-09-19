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
        price: cartItem.productVariant.price, // Variant price bilgisini ekle
        size: cartItem.productVariant.size,
        aroma: cartItem.productVariant.aroma,
      },
      added_at: cartItem.createdAt,
    };
  }

  static format(cart: CartPayload) {
    const subtotal = cart.items.reduce((acc, item) => {
      // Variant price'ı kullan (discounted_price varsa onu, yoksa total_price)
      const variantPrice = item.productVariant.price as any;
      const itemPrice = (variantPrice?.discounted_price || variantPrice?.total_price || item.product.price) as number;
      return acc + itemPrice * item.quantity;
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
