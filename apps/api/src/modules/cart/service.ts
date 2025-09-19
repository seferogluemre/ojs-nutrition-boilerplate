import { prisma } from '#core/index';
import { HandleError } from '#shared/error/handle-error';
import { BadRequestException } from '#utils/index';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NotFoundError } from 'elysia';

import { Prisma } from '@prisma/client';
import { AddToCartParams, GetCartParams, RemoveFromCartParams } from './types';

export abstract class CartService {
  static async create(params: AddToCartParams) {
    const { user_id, product_id, product_variant_id, quantity } = params;

    const product = await prisma.product.findUnique({
      where: { uuid: product_id },
      select: { id: true, price: true, stock: true, isActive: true, name: true },
    });

    const productVariant = await prisma.productVariant.findUnique({
      where: { uuid: product_variant_id },
      select: { id: true, productId: true },
    });

    if (!product || !productVariant) {
      throw new NotFoundError('Ürün veya ürün varyantı bulunamadı.');
    }

    if (productVariant.productId !== product.id) {
      throw new BadRequestException('Ürün varyantı, belirtilen ürüne ait değil.');
    }

    if (product.stock < quantity) {
      throw new BadRequestException(
        `${product.name} için yeterli stok yok, Mevcut:${product.stock}`,
      );
    }

    if (!product.isActive) {
      throw new BadRequestException(`${product.name} şu anda satışta değil.`);
    }

    const cart = await prisma.cart.upsert({
      where: { userId: user_id.toString() },
      update: {},
      create: {
        userId: user_id.toString(),
      },
      select: { id: true },
    });

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productVariantId: productVariant.id,
      },
    });

    if (existingItem) {
      const newTotalQuantity = existingItem.quantity + quantity;
      if (newTotalQuantity > product.stock) {
        throw new BadRequestException(
          `${product.name} için yeterli stok yok. Mevcut: ${product.stock}, Toplam istenilen: ${newTotalQuantity}`,
        );
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: newTotalQuantity,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          productVariantId: productVariant.id,
          quantity: quantity,
          unitPrice: product.price, 
        },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: {
        id: cart.id,
      },
      include: {
        items: {
          orderBy: { createdAt: 'desc' },
          include: {
            product: true,
            productVariant: true,
          },
        },
        user: true,
      },
    });

    if (!updatedCart) {
      throw new NotFoundError('Sepet güncellenirken bir sorun oluştu.');
    }

    return updatedCart;
  }

  static async get(params: GetCartParams) {
    try {
      const { user_id } = params;

      const cart = await prisma.cart.findUnique({
        where: {
          userId: user_id,
        },
        include: {
          items: {
            include: {
              product: true,
              productVariant: {
                select: {
                  uuid: true,
                  name: true,
                  price: true, // Variant price bilgisini include et
                  size: true,
                  aroma: true,
                },
              },
            },
          },
          user: true,
        },
      });

      if (!cart) {
        throw new NotFoundError('Sepet bulunamadı.');
      }

      return cart;
    } catch (error) {
      throw HandleError.handlePrismaError(error as PrismaClientKnownRequestError, 'cart', 'find');
    }
  }

  static async delete(params: RemoveFromCartParams) {
    try {
      const { user_id, item_uuid } = params;

      const cart = await prisma.cart.findUnique({
        where: { userId: user_id },
      });

      if (!cart) {
        throw new NotFoundError('Sepet bulunamadı.');
      }

      const cartItem = await prisma.cartItem.findFirst({
        where: {
          uuid: item_uuid,
          cartId: cart.id,
        },
      });

      if (!cartItem) {
        throw new NotFoundError('Sepet öğesi bulunamadı.');
      }

      await prisma.cartItem.delete({
        where: { uuid: item_uuid },
      });

      const updatedCart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: {
          items: {
            orderBy: { createdAt: 'desc' },
            include: {
              product: true,
              productVariant: true,
            },
          },
          user: true,
        },
      });

      return updatedCart;
    } catch (error) {
      throw HandleError.handlePrismaError(
        error as Prisma.PrismaClientKnownRequestError,
        'cart',
        'delete',
      );
    }
  }

  static async clear(params: { user_id: string }) {
    try {
      const { user_id } = params;

      const cart = await prisma.cart.findUnique({
        where: {
          userId: user_id,
        },
      });

      if (!cart) {
        throw new NotFoundError('Sepet bulunamadı');
      }

      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      const updatedCart = await prisma.cart.findUnique({
        where: {
          id: cart.id,
        },
        include: {
          items: {
            orderBy: { createdAt: 'desc' },
            include: {
              product: true,
              productVariant: true,
            },
          },
          user: true,
        },
      });
      return updatedCart;
    } catch (error) {
      throw HandleError.handlePrismaError(error, 'cart', 'delete');
    }
  }
}
