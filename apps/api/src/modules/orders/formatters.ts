import type { OrderService } from './service';
import { ShippingAddress } from './types';

type OrderPayload = NonNullable<Awaited<ReturnType<typeof OrderService.getOrderDetail>>>;
type OrdersListPayload = NonNullable<Awaited<ReturnType<typeof OrderService.getUserOrders>>>;

type OrderItemPayload = OrderPayload['items'][0];

/**
 * Sipariş verilerini API yanıtları için formatlayan bir yardımcı sınıf.
 * Veritabanı nesnelerini istemci dostu yapılara dönüştürmek için statik metotlar içerir.
 */
export abstract class OrderFormatter {
  /**
   * Tek bir sipariş öğesini formatlar.
   * @param orderItem - Veritabanından gelen sipariş öğesi nesnesi.
   * @returns İstemci dostu formatlanmış sipariş öğesi.
   */
  static formatItem(orderItem: OrderItemPayload) {
    return {
      id: orderItem.uuid,
      quantity: orderItem.quantity,
      unitPrice: orderItem.unitPrice,
      totalPrice: orderItem.totalPrice,
      product: {
        id: orderItem.product.uuid,
        name: orderItem.product.name,
        slug: orderItem.product.slug,
        price: orderItem.product.price,
        primary_photo_url: orderItem.product.primaryPhotoUrl,
      },
    };
  }

  /**
   * Tüm sipariş nesnesini API yanıtı için formatlar.
   * @param order - Service katmanından gelen tam sipariş nesnesi.
   * @returns İstemci dostu formatlanmış sipariş.
   */
  static format(order: OrderPayload) {
    return {
      id: order?.uuid,
      orderNumber: order?.orderNumber,
      status: order?.status,
      subtotal: order?.subtotal,
      shippingAddress: order?.shippingAddress as ShippingAddress,
      items: order?.items.map(OrderFormatter.formatItem),
      createdAt: order?.createdAt instanceof Date ? order.createdAt.toISOString() : order?.createdAt,
      updatedAt: order?.updatedAt instanceof Date ? order.updatedAt.toISOString() : order?.updatedAt,
      user: {
        id: order?.user?.id || '',
        name: order?.user?.name || '',
        email: order?.user?.email || '',
      },
      parcels: order?.parcels.map(parcel => ({
        ...parcel,
        estimatedDelivery: parcel.estimatedDelivery instanceof Date
          ? parcel.estimatedDelivery.toISOString()
          : parcel.estimatedDelivery,
        actualDelivery: parcel.actualDelivery instanceof Date
          ? parcel.actualDelivery.toISOString()
          : parcel.actualDelivery,
        createdAt: parcel.createdAt instanceof Date
          ? parcel.createdAt.toISOString()
          : parcel.createdAt,
        updatedAt: parcel.updatedAt instanceof Date
          ? parcel.updatedAt.toISOString()
          : parcel.updatedAt,
        events: parcel.events.map(event => ({
          ...event,
          createdAt: event.createdAt instanceof Date
            ? event.createdAt.toISOString()
            : event.createdAt,
          actualDelivery: event.actualDelivery instanceof Date
            ? event.actualDelivery.toISOString()
            : event.actualDelivery || "Teslimat tarihi bilinmiyor",
          estimatedDelivery: event.estimatedDelivery instanceof Date
            ? event.estimatedDelivery.toISOString()
            : event.estimatedDelivery || "Tahmini teslimat tarihi bilinmiyor",
        })),
      })),
    };
  }
  

  /**
   * Sipariş listesi için formatlar (özet bilgiler).
   * @param orders - Service katmanından gelen siparişler listesi.
   * @returns İstemci dostu formatlanmış sipariş listesi.
   */
  static formatList(orders: OrdersListPayload) {
    return orders?.map((order) => {
      // İlk ürünün bilgilerini al
      const firstItem = order.items[0];
      const firstProduct = firstItem?.product;
      
      return {
        id: order.uuid,
        orderNumber: order.orderNumber,
        status: order.status,
        subtotal: order.subtotal,
        itemCount: order.items.length,
        createdAt: order.createdAt,
        // Sipariş listesi için ürün bilgileri
        firstProduct: firstProduct ? {
          name: firstProduct.name,
          primary_photo_url: firstProduct.primaryPhotoUrl,
        } : null,
        // Ürün sayısı metni
        productDisplayText: order.items.length === 1 
          ? firstProduct?.name 
          : `${order.items.length} farklı ürün`,
      };
    });
  }
}
