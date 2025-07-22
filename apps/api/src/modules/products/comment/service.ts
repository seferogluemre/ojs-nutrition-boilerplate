import prisma from '#core/prisma';
import { HandleError } from '#shared/error/handle-error';

import { NotFoundException } from '../../../utils';
import { CreateCommentParams, GetCommentsParams, ProductCommentWithRelations } from './types';

export abstract class ProductCommentService {
  static async getCommentsByProduct(
    params: GetCommentsParams,
  ): Promise<{ data: ProductCommentWithRelations[]; meta: any }> {
    try {
      const { productId, limit = 10, offset = 0 } = params;

      // Product exists kontrolü
      const product = await prisma.product.findUnique({
        where: { uuid: productId },
        select: { id: true },
      });

      if (!product) {
        throw new NotFoundException('Ürün bulunamadı');
      }

      const [data, total] = await Promise.all([
        prisma.productComments.findMany({
          where: {
            productId: product.id,
          },
          include: {
            Customer: {
              select: {
                uuid: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip: offset,
          take: limit,
        }),
        prisma.productComments.count({
          where: {
            productId: product.id,
          },
        }),
      ]);

      return {
        data: data as ProductCommentWithRelations[],
        meta: {
          total,
          limit,
          offset,
          hasNext: offset + limit < total,
        },
      };
    } catch (error) {
      await HandleError.handlePrismaError(error, 'product-comment', 'find');
      throw error;
    }
  }

  static async createComment(params: CreateCommentParams): Promise<ProductCommentWithRelations> {
    try {
      const { productId, customerId, data } = params;

      // Product exists kontrolü
      const product = await prisma.product.findUnique({
        where: { uuid: productId },
        select: { id: true },
      });

      if (!product) {
        throw new NotFoundException('Ürün bulunamadı');
      }

      // Customer exists kontrolü
      const customer = await prisma.customer.findUnique({
        where: { uuid: customerId },
        select: { id: true },
      });

      if (!customer) {
        throw new NotFoundException('Müşteri bulunamadı');
      }

      // Comment oluştur
      const comment = await prisma.productComments.create({
        data: {
          productId: product.id,
          customerId: customer.id,
          title: data.title,
          content: data.content,
          rating: data.rating,
        },
        include: {
          Customer: {
            select: {
              uuid: true,
              name: true,
            },
          },
        },
      });

      // Product'ın rating bilgilerini güncelle
      await this.updateProductRating(product.id);

      return comment as ProductCommentWithRelations;
    } catch (error) {
      await HandleError.handlePrismaError(error, 'product-comment', 'create');
      throw error;
    }
  }

  private static async updateProductRating(productId: number) {
    try {
      const stats = await prisma.productComments.aggregate({
        where: { productId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await prisma.product.update({
        where: { id: productId },
        data: {
          averageRating: Math.round(stats._avg.rating || 0),
          reviewCount: stats._count.rating,
        },
      });
    } catch (error) {
      console.error('Error updating product rating:', error);
      // Rating güncelleme hatası comment oluşturmayı engellemez
    }
  }
}
