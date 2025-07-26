import { prisma } from '#core';
import { HandleError } from '#shared/error/handle-error';
import { NotFoundException } from '../../../utils';
import { CreateCommentParams, ProductCommentsWithUser } from './types';

export abstract class ProductCommentService {
  static async getComments(params: { productId: string; page?: number; limit?: number }): Promise<{ data: ProductCommentsWithUser[]; total: number }> {
    try {
      const { productId, page = 1, limit = 10 } = params;
      
      if (!productId) {
        throw new NotFoundException('Product ID eksik');
      }

      const skip = (page - 1) * limit;

      const product = await prisma.product.findUnique({
        where: { uuid: productId }, // UUID field kullan
      });

      if (!product) {
        throw new NotFoundException('Ürün bulunamadı');
      }

      const [data, total] = await Promise.all([
        prisma.productComments.findMany({
          where: {
            productId: product.id,
            user: {
              deletedAt: null, // Only include users that are not deleted
            },
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limit,
        }),
        prisma.productComments.count({
          where: {
            productId: product.id,
            user: {
              deletedAt: null, // Only count comments with non-deleted users
            },
          },
        }),
      ]);

      return { data: data as ProductCommentsWithUser[], total };
    } catch (error) {
      await HandleError.handlePrismaError(error, 'productComments', 'find');
      throw error;
    }
  }

  static async createComment(params: CreateCommentParams): Promise<ProductCommentsWithUser> {
    try {
      const { productId, userId, data } = params;
      
      if (!productId) {
        throw new NotFoundException('Product ID eksik');
      }

      const product = await prisma.product.findUnique({
        where: { uuid: productId }, // UUID field kullan
      });

      if (!product) {
        throw new NotFoundException('Ürün bulunamadı');
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('Kullanıcı bulunamadı');
      }

      const comment = await prisma.productComments.create({
        data: {
          productId: product.id, // Integer ID kullan
          userId: user.id,
          title: data.title || '',
          content: data.content,
          rating: data.rating,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return comment as ProductCommentsWithUser;
    } catch (error) {
      await HandleError.handlePrismaError(error, 'productComments', 'create');
      throw error;
    }
  }
}
