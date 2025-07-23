import { prisma } from '#core';
import { HandleError } from '#shared/error/handle-error';
import { BadRequestException } from '#utils';
import { NotFoundError } from 'elysia';

import {
  CreateVariantParams,
  DeleteVariantParams,
  GetProductVariantParams,
  UpdateVariantParams,
} from './types';

export abstract class ProductVariantService {
  static async get(params: GetProductVariantParams) {
    try {
      const { product_id } = params;

      const product = await prisma.product.findMany({
        where: {
          uuid: product_id,
        },
        select: { id: true },
      });

      if (!product) {
        throw new NotFoundError('Ürün bulunamadı.');
      }

      const variants = await prisma.productVariant.findMany({
        where: {
          productId: parseInt(product.id),
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      return variants;
    } catch (error) {
      throw HandleError.handlePrismaError(error, 'product-variant', 'find');
    }
  }

  static async create(params: CreateVariantParams) {
    try {
      const { product_id } = params;

      const product = await prisma.product.findUnique({
        where: {
          uuid: product_id,
        },
        select: { id: true },
      });

      if (!product) {
        throw new NotFoundError('Ürün bulunamadı.');
      }

      const existingVariant = await prisma.productVariant.findFirst({
        where: {
          productId: product.id,
          name: params.name,
        },
      });

      if (existingVariant) {
        throw new BadRequestException('Bu ürün için aynı isimde varyant zaten mevcut.');
      }

      const variant = await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: params.name,
        },
      });

      return variant;
    } catch (error) {
      throw HandleError.handlePrismaError(error, 'product-variant', 'create');
    }
  }

  static async update(params: UpdateVariantParams) {
    try {
      const { variant_id, name } = params;

      const variant = await prisma.productVariant.findUnique({
        where: { uuid: variant_id },
        select: {
          product: true,
        },
      });

      if (!variant) {
        throw new NotFoundError('Varyant bulunamadı.');
      }

      const existingVariant = await prisma.productVariant.findFirst({
        where: {
          productId: variant.product.id,
          name: this.name,
          uuid: { not: variant_id },
        },
      });

      if (existingVariant) {
        throw new BadRequestException('Bu ürün için aynı isimde varyant zaten mevcut.');
      }

      const updatedVariant = await prisma.productVariant.update({
        where: { uuid: variant_id },
        data: { name },
      });

      return updatedVariant;
    } catch (error) {
      throw HandleError.handlePrismaError(error, 'product-variant', 'update');
    }
  }

  static async delete(params: DeleteVariantParams) {
    try {
      const { variant_id, product_id } = params;

      const variant = await prisma.productVariant.findUnique({
        where: {
          uuid: variant_id,
        },
        select: {
          product: true,
        },
      });

      if (!variant) {
        throw new NotFoundError('Varyant bulunamadı.');
      }

      if (variant.product.uuid !== product_id) {
        throw new BadRequestException('Bu varyant belirtilen ürüne ait değil.');
      }

      const cartItemsWithVariant = await prisma.cartItem.findFirst({
        where: { productVariantId: variant.product.id },
      });

      if (cartItemsWithVariant) {
        throw new BadRequestException('Bu varyant sepetlerde kullanıldığı için silinemez.');
      }

      await prisma.productVariant.delete({
        where: { uuid: variant_id },
      });

      return { message: 'Varyant başarıyla silindi.' };
    } catch (error) {
      throw HandleError.handlePrismaError(error, 'product-variant', 'delete');
    }
  }
}
