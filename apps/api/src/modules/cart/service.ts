import { prisma } from '#core';
import { HandleError } from '#shared/error/handle-error';
import { BadRequestException } from '#utils';
import { Prisma } from '@prisma/client';
import { NotFoundError } from 'elysia';

import { AddToCartParams, GetCartParams, RemoveFromCartParams } from './types';

export abstract class CartService {
  static async create(params: AddToCartParams) {
    const { customer_id, product_id, product_variant_id, quantity } = params;

    const product = await prisma.product.findUnique({
      where: { uuid: product_id },
      select: { id: true },
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

    const cart = await prisma.cart.upsert({
      where: { userId: customer_id },
      update: {},
      create: {
        userId: customer_id,
      },
      select: { id: true },
    });

    // 4. Sepet öğesini bul veya oluştur/güncelle (upsert).
    // Prisma'nın bu özelliği sayesinde, eğer ürün sepette varsa 'update' bloğu,
    // yoksa 'create' bloğu çalışır.
    await prisma.cartItem.upsert({
      where: {
        cartId_productVariantId: {
          cartId: cart.id,
          productVariantId: productVariant.id,
        },
      },
      update: {
        quantity: {
          increment: quantity, // Mevcut adetin üzerine ekle
        },
      },
      create: {
        cartId: cart.id,
        productId: product.id,
        productVariantId: productVariant.id,
        quantity: quantity,
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
          customer: true,
        },
      });

      if (!cart) {
        throw new NotFoundError('Sepet bulunamadı.');
      }

      return cart;
    } catch (error) {
      await HandleError.handlePrismaError(
        error as Prisma.PrismaClientKnownRequestError,
        'cart',
        'find',
      );
    }
  }

  static async delete(params: RemoveFromCartParams) {
    try {
      const { customer_id, item_uuid } = params;

      const cart = await prisma.cart.findUnique({
        where: { customerId: customer_id },
      });

      if (!cart) {
        throw new NotFoundError('Sepet bulunamadı.');
      }

      await prisma.cartItem.delete({
        where: { id: item_uuid },
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
        },
        user: true,
      });

      return updatedCart;
    } catch (error) {
      await HandleError.handlePrismaError(
        error as Prisma.PrismaClientKnownRequestError,
        'cart',
        'delete',
      );
    }
  }

  static async clear(params: { customer_id: string }) {
    try {
      const { customer_id } = params.customer_id;

      const cart=await prisma.cart.findUnique({
        where:{
          userId:customer_id
        }
      })
      
      if(!cart){
        throw new NotFoundError("Sepet bulunamadı")
      }

      await prisma.cartItem.deleteMany({
        where:{
          cartId:cart.id
        }
      })

      const updatedCart=await prisma.cart.findUnique({
        where:{
          id:cart.id
        },
        include:{
          items:{
            orderBy:{createdAt:'desc'},
            include:{
              product:true,
              productVariant:true
            }
          },
          user:true        
        }
      })
      return updatedCart;
    } catch (error) {
      await HandleError.handlePrismaError(error, 'cart', 'delete');
    }
  }
}
