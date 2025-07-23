import { prisma } from '#core';
import { HandleError } from '#shared/error/handle-error';
import { BadRequestException } from '#utils';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NotFoundError } from 'elysia';

import { AddToCartParams, GetCartParams, RemoveFromCartParams } from './types';

export abstract class CartService {
  static async create(params: AddToCartParams) {
    const { customer_id, product_id, product_variant_id, quantity } = params;

    // 1. Product'ı kontrol et
    const product = await prisma.product.findUnique({
      where: { uuid: product_id },
      select: { id: true, price: true, stock: true, isActive: true, name: true },
    });

    // 2. Product variant'ı kontrol et
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

    // 3. Cart'ı bul veya oluştur
    const cart = await prisma.cart.upsert({
      where: { userId: customer_id.toString() },
      update: {},
      create: {
        userId: customer_id.toString(),
      },
      select: { id: true },
    });

    // 4. Sepette var mı kontrol et
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productVariantId: productVariant.id,
      },
    });

    if (existingItem) {
      // Stock kontrolü (mevcut + yeni quantity)
      const newTotalQuantity = existingItem.quantity + quantity;
      if (newTotalQuantity > product.stock) {
        throw new BadRequestException(
          `${product.name} için yeterli stok yok. Mevcut: ${product.stock}, Toplam istenilen: ${newTotalQuantity}`,
        );
      }

      // Varsa quantity'yi artır
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: newTotalQuantity,
        },
      });
    } else {
      // Yoksa yeni oluştur
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          productVariantId: productVariant.id,
          quantity: quantity,
          unitPrice: product.price, // Product'ın güncel fiyatını al
        },
      });
    }

    // 5. Güncellenmiş sepeti döndür
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
      const { customer_id } = params;

      const cart = await prisma.cart.findUnique({
        where: {
          userId: customer_id,
        },
        include: {
          items: {
            include: {
              product: true,
              productVariant: true,
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
      const { customer_id, item_uuid } = params;

      // 1. Cart'ı bul
      const cart = await prisma.cart.findUnique({
        where: { userId: customer_id },
      });

      if (!cart) {
        throw new NotFoundError('Sepet bulunamadı.');
      }

      // 2. Item'ın bu cart'ta olup olmadığını kontrol et
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          uuid: item_uuid,
          cartId: cart.id, // Sadece bu kullanıcının cart'ından silebilir
        },
      });

      if (!cartItem) {
        throw new NotFoundError('Sepet öğesi bulunamadı.');
      }

      // 3. Item'ı sil
      await prisma.cartItem.delete({
        where: { uuid: item_uuid },
      });

      // 4. Güncellenmiş sepeti döndür
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
      throw await HandleError.handlePrismaError(
        error as PrismaClientKnownRequestError,
        'cart',
        'delete',
      );
    }
  }

  static async clear(params: { customer_id: string }) {
    try {
      const { customer_id } = params;

      const cart = await prisma.cart.findUnique({
        where: {
          userId: customer_id,
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
      throw await HandleError.handlePrismaError(error, 'cart', 'delete');
    }
  }
}
