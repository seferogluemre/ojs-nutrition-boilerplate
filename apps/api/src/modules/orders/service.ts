import { prisma } from '#core';
import { HandleError } from '#shared/error/handle-error';
import { BadRequestException } from '#utils';
import { NotFoundError } from 'elysia';

import { CompleteOrderParams, GetOrderDetailParams, GetUserOrdersParams } from './types';

export abstract class OrderService {
  static async getUserOrders(params: GetUserOrdersParams) {
    try {
      const { user_id } = params;

      const orders = await prisma.order.findMany({
        where: {
          userId: user_id,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return orders;
    } catch (error) {
      await HandleError.handlePrismaError(
        error,
        'order',
        'find',
      );
    }
  }

  static async getOrderDetail(params: GetOrderDetailParams) {
    try {
      const { user_id, order_id } = params;

      const order = await prisma.order.findFirst({
        where: {
          uuid: order_id,
          userId: user_id, // Sadece kullanıcının kendi siparişine erişebilir
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });

      if (!order) {
        throw new NotFoundError('Sipariş bulunamadı.');
      }

      return order;
    } catch (error) {
      await HandleError.handlePrismaError(
        error,
        'order',
        'find',
      );
    }
  }

  static async completeOrder(params: CompleteOrderParams) {
    try {
      const { user_id, address_id } = params;

      // 1. Kullanıcının sepetini al
      const cart = await prisma.cart.findUnique({
        where: {
          userId: user_id,
        },
        include: {
          items: {
            include: {
              product: true,
              productVariant: true,
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Sepetinizde ürün bulunmuyor.');
      }

      // 2. Adresi kontrol et (optional)
      let address = null;
      let shippingAddressData = null;

      if (address_id) {
        address = await prisma.userAddress.findFirst({
          where: {
            uuid: address_id,
            userId: user_id,
          },
          include: {
            city: {
              include: {
                country: true,
                state: true,
              },
            },
          },
        });

        if (!address) {
          throw new NotFoundError('Adres bulunamadı.');
        }

        shippingAddressData = {
          title: address.title,
          recipientName: address.recipientName,
          phone: address.phone,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          postalCode: address.postalCode,
          city: address.city.name,
          state: address.city.state.name,
          country: address.city.country.name,
        };
      } else {
        // Address yoksa default değerler
        shippingAddressData = {
          title: 'Varsayılan Adres',
          recipientName: 'Belirtilmemiş',
          phone: 'Belirtilmemiş',
          addressLine1: 'Belirtilmemiş',
          addressLine2: undefined,
          postalCode: 'Belirtilmemiş',
          city: 'Belirtilmemiş',
          state: 'Belirtilmemiş',
          country: 'Belirtilmemiş',
        };
      }

      // 3. Sipariş numarası oluştur
      const orderNumber = await this.generateOrderNumber();

      // 4. Toplam tutarı hesapla
      const subtotal = cart.items.reduce((acc, item) => {
        return acc + item.product.price * item.quantity;
      }, 0);

      // 5. Sipariş oluştur
      const order = await prisma.order.create({
        data: {
          userId: user_id,
          orderNumber,
          subtotal,
          shippingAddress: shippingAddressData,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.product.price,
              totalPrice: item.product.price * item.quantity,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });

      // 6. Sepeti temizle
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return order;
    } catch (error) {
      await HandleError.handlePrismaError(
        error,
        'order',
        'create',
      );
    }
  }

  private static async generateOrderNumber(): Promise<string> {
    const prefix = 'ORD';
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `${prefix}${timestamp}${random}`;
  }
} 