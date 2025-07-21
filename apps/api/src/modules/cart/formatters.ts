import type { CartService } from './service';

type CartPayload = Awaited<ReturnType<typeof CartService.create>>;

type CartItemPayload = CartPayload['items'][0];

/**
 * Sepet verilerini API yanıtları için formatlayan bir yardımcı sınıf.
 * Veritabanı nesnelerini istemci dostu yapılara dönüştürmek için statik metotlar içerir.
 */
export abstract class CartFormatter {
  /**
   * Tek bir sepet öğesini formatlar. Bu metot, ana format metoduna yardımcı olduğu için
   * 'private' olarak işaretlenmiştir ve sadece sınıf içinden erişilebilir.
   * @param cartItem - Veritabanından gelen sepet öğesi nesnesi.
   * @returns İstemci dostu formatlanmış sepet öğesi.
   */
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

  /**
   * Tüm sepet nesnesini API yanıtı için formatlar.
   * @param cart - Service katmanından gelen tam sepet nesnesi.
   * @returns İstemci dostu formatlanmış sepet.
   */
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
