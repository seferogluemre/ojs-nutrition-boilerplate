import { BadRequestException } from '#utils';
import { NotFoundError } from 'elysia';
import prisma from '../../core/prisma';
import { HandleError } from "../../shared/error/handle-error";

import { OrderQueueService } from './queue/service';
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
          user: {
            include: {
              cart: {
                include: {
                  items: {
                    include: {
                      product: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return orders;
    } catch (error) {
      throw HandleError.handlePrismaError(error, 'order', 'find');
    }
  }

  static async getOrderDetail(params: GetOrderDetailParams) {
    try {
      const { user_id, order_id } = params;

      const order = await prisma.order.findFirst({
        where: {
          uuid: order_id,
          userId: user_id, 
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

      const parcels = await prisma.parcel.findMany({
        where: {
          trackingNumber: order.orderNumber,
        },
        include: {
          events: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        ...order,
        parcels,
      };
    } catch (error) {
      throw HandleError.handlePrismaError(error, 'order', 'find');
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

      for (const item of cart.items) {
        if (item.quantity > item.product.stock) {
          throw new BadRequestException(
            `${item.product.name} için yeterli stok bulunmamaktadır. Mevcut:${item.product.stock}, İstenen:${item.quantity}`,
          );
        }

        if (item.product.stock <= 0 || !item.product.isActive) {
          throw new BadRequestException(`${item.product.name} stokta yok veya aktif degil`);
        }
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

      const orderNumber = await this.generateOrderNumber();

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

      for (const item of cart.items) {
        const newStock = item.product.stock - item.quantity;

        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: newStock,
            isActive: newStock > 0 ? item.product.isActive : false,
          },
        });
      }

      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      await OrderQueueService.addOrderConfirmationJob({
        orderId: order.uuid,
        userId: order.userId,
        orderNumber: order.orderNumber,
        userEmail: order.user?.email || '', // user email'i varsa al
        userName: order.user?.name || order.user?.email || 'Müşteri',
      });

      // Otomatik parcel oluştur ve kurye ata
      try {
        await this.createParcelFromOrder(order);
      } catch (error) {
        console.error(`❌ Failed to create parcel for order ${order.uuid}:`, error);
        // Parcel oluşturma hatası sipariş oluşturmayı engellemez
      }

      return order;
    } catch (error) {
      throw await HandleError.handlePrismaError(error, 'order', 'create');
    }
  }

  static async updateOrderStatus(orderId: string, status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED') {
    try {
      const order = await prisma.order.update({
        where: { uuid: orderId },
        data: { status },
        include: {
          user: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      console.log(`📦 Order ${orderId} status updated to: ${status}`);
      return order;
    } catch (error) {
      console.error(`❌ Failed to update order ${orderId} status:`, error);
      throw HandleError.handlePrismaError(error, 'order', 'update');
    }
  }

  static async getAvailableCourier(): Promise<string | null> {
    try {
    
      const couriers = await prisma.user.findMany({
        where: {
          userRoles: {
            some: {
              role: {
                name: 'Courier'
              }
            }
          },
          deletedAt: null,
        },
        include: {
          _count: {
            select: {
              assignedParcels: {
                where: {
                  status: {
                    notIn: ['DELIVERED', 'CANCELLED', 'RETURNED']
                  }
                }
              }
            }
          }
        },
        orderBy: {
          assignedParcels: {
            _count: 'asc' // En az işi olan kurye
          }
        },
        take: 1
      });

      if (couriers.length > 0) {
        return couriers[0].id;
      }

      console.log('⚠️ No available courier found');
      return null;
    } catch (error) {
      console.error('❌ Failed to get available courier:', error);
      return null;
    }
  }

  static async createParcelFromOrder(order: any) {
    try {
      const { ParcelService } = await import('../parcels/service');
      
      const availableCourier = await this.getAvailableCourier();
      
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

      const parcel = await ParcelService.create({
        orderId: order.uuid,
        courierId: availableCourier || undefined,
        estimatedDelivery: estimatedDelivery,
      });

      if (availableCourier && parcel) {
        try {
          await ParcelService.assignCourier(parcel.id, availableCourier);
          console.log(`📦 Parcel created and courier assigned for order: ${order.orderNumber}`);
          
          // Order statusunu CONFIRMED yap
          await this.updateOrderStatus(order.uuid, 'CONFIRMED');
        } catch (assignError) {
          console.error(`⚠️ Failed to assign courier to parcel ${parcel.id}:`, assignError);
          // Kurye atama başarısız olsa da parcel oluşturulmuş
        }
      } else {
        console.log(`📦 Parcel created without courier assignment for order: ${order.orderNumber}`);
      }

      return parcel;
    } catch (error) {
      console.error(`❌ Failed to create parcel from order ${order.uuid}:`, error);
      throw error;
    }
  }

  private static async generateOrderNumber(): Promise<string> {
    const prefix = 'ORD';
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');

    return `${prefix}${timestamp}${random}`;
  }
}
