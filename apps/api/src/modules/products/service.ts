import prisma from '#core/prisma';
import { Prisma } from '#prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { NotFoundException } from '../../utils';
import {
  ProductCreatePayload,
  ProductIndexQuery,
  ProductUpdatePayload,
  ProductWithRelations,
} from './types';

export abstract class ProductsService {
  private static async handlePrismaError(
    error: unknown,
    context: 'find' | 'create' | 'update' | 'delete',
  ) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Ürün bulunamadı');
      }
    }
    console.error(`Error in ProductsService.${context}:`, error);
    throw error;
  }

  private static async buildWhereClause(query: ProductIndexQuery): Promise<Prisma.ProductWhereInput> {
    const where: Prisma.ProductWhereInput = {};

    // UUID formatında main_category varsa, önce kategori ID'sini bul
    if (query.main_category) {
      const category = await prisma.category.findUnique({
        where: { uuid: query.main_category },
        select: { id: true }
      });

      if (!category) {
        throw new NotFoundException('Kategori bulunamadı');
      }

      where.categoryId = category.id;
    }

    if (query.isActive !== undefined) where.isActive = query.isActive;

    if (query.priceMin !== undefined || query.priceMax !== undefined) {
      where.price = {};
      if (query.priceMin !== undefined) where.price.gte = query.priceMin;
      if (query.priceMax !== undefined) where.price.lte = query.priceMax;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { shortDescription: { contains: query.search, mode: 'insensitive' } },
        { longDescription: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private static buildOrderBy(query: ProductIndexQuery): Prisma.ProductOrderByWithRelationInput {
    const { sortBy = 'createdAt', sortDirection = 'desc' } = query;
    return { [sortBy]: sortDirection };
  }

  static async index(
    query: ProductIndexQuery = {},
  ): Promise<{ data: ProductWithRelations[]; meta: any }> {
    try {
      const { page = 1, limit = 20 } = query;
      const skip = (page - 1) * limit;

      const where = await this.buildWhereClause(query);
      const orderBy = this.buildOrderBy(query);

      const [data, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: {
            category: {
              select: {
                id: true,
                uuid: true,
                name: true,
                slug: true,
              },
            },
            productVariants: {
              select: {
                uuid: true,
                name: true,
                size: true,
                aroma: true,
                price: true,
                photoSrc: true,
                isAvailable: true,
              },
            },
            photos: {
              select: {
                uuid: true,
                url: true,
                isPrimaryPhoto: true,
                order: true,
                fileSize: true,
              },
            },
            comments: {
              select: {
                id: true,
              },
            },
          },
        }),
        prisma.product.count({ where }),
      ]);

      const formattedData = data.map((product) => ({
        ...product,
        photos: [],
        comments: [],
        variants: product.productVariants,
        commentsCount: product.comments.length,
      })) as unknown as ProductWithRelations[];

      return {
        data: formattedData,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw this.handlePrismaError(error, 'find');
    }
  }

  static async show(uuid: string): Promise<ProductWithRelations> {
    try {
      // First try by UUID, then by slug as fallback
      let product = await prisma.product.findUnique({
        where: { uuid },
        include: {
          category: {
            select: {
              id: true,
              uuid: true,
              name: true,
              slug: true,
            },
          },
          productVariants: {
            select: {
              uuid: true,
              name: true,
              size: true,
              aroma: true,
              price: true,
              photoSrc: true,
              isAvailable: true,
            },
          },
          photos: {
            select: {
              uuid: true,
              url: true,
              isPrimaryPhoto: true,
              order: true,
              fileSize: true,
            },
          },
          comments: {
            select: {
              id: true,
            },
          }
        },
      });

      // If not found by UUID, try by slug
      if (!product) {
        product = await prisma.product.findUnique({
          where: { slug: uuid }, // uuid might actually be a slug
          include: {
            category: {
              select: {
                id: true,
                uuid: true,
                name: true,
                slug: true,
              },
            },
            productVariants: {
              select: {
                uuid: true,
                name: true,
                size: true,
                aroma: true,
                price: true,
                photoSrc: true,
                isAvailable: true,
              },
            },
            photos: {
              select: {
                uuid: true,
                url: true,
                isPrimaryPhoto: true,
                order: true,
                fileSize: true,
              },
            },
            comments: {
              select: {
                id: true,
              },
            }
          },
        });
      }

      if (!product) {
        throw new NotFoundException('Ürün Kaldırıldı');
      }
      return {
        ...product,
        photos: [],
        variants: product.productVariants,
        comments: [],
        commentsCount: product.comments.length,
      } as unknown as ProductWithRelations;
    } catch (error) {
      throw this.handlePrismaError(error, 'find');
    }
  }

  static async store(data: ProductCreatePayload): Promise<ProductWithRelations> {
    try {
      // UUID categoryId'yi numeric ID'ye çevir
      const category = await prisma.category.findUnique({
        where: { uuid: data.categoryId },
        select: { id: true }
      });

      if (!category) {
        throw new NotFoundException('Kategori bulunamadı');
      }

      const product = await prisma.product.create({
        data: {
          ...data,
          categoryId: category.id,
          primaryPhotoUrl: data.primaryPhotoUrl || '',
        },
        include: {
          category: {
            select: {
              id: true,
              uuid: true,
              name: true,
              slug: true,
            },
          },
          productVariants: {
            select: {
              uuid: true,
              name: true,
              size: true,
              aroma: true,
              price: true,
              photoSrc: true,
              isAvailable: true,
            },
          },
          photos: {
            select: {
              uuid: true,
              url: true,
              isPrimaryPhoto: true,
              order: true,
              fileSize: true,
            },
          },
        },
      });

      return {
        ...product,
        photos: [],
        productVariants: [],
        comments: [],
      } as unknown as ProductWithRelations;
    } catch (error) {
      throw this.handlePrismaError(error, 'create');
    }
  }

  static async update(uuid: string, data: ProductUpdatePayload): Promise<ProductWithRelations> {
    try {
      let updateData: any = { ...data };

      // Eğer categoryId UUID olarak gelirse numeric ID'ye çevir
      if (data.categoryId) {
        const category = await prisma.category.findUnique({
          where: { uuid: data.categoryId },
          select: { id: true }
        });

        if (!category) {
          throw new NotFoundException('Kategori bulunamadı');
        }

        updateData = {
          ...updateData,
          categoryId: category.id, // UUID yerine numeric ID kullan
        };
      }

      const product = await prisma.product.update({
        where: { uuid },
        data: updateData,
        include: {
          category: {
            select: {
              id: true,
              uuid: true,
              name: true,
              slug: true,
            },
          },
          productVariants: {
            select: {
              uuid: true,
              name: true,
              size: true,
              aroma: true,
              price: true,
              photoSrc: true,
              isAvailable: true,
            },
          },
          photos: {
            select: {
              uuid: true,
              url: true,
              isPrimaryPhoto: true,
              order: true,
              fileSize: true,
            },
          },
        },
      });

      return product as unknown as ProductWithRelations;
    } catch (error) {
      throw this.handlePrismaError(error, 'update');
    }
  }

  static async destroy(uuid: string): Promise<void> {
    try {
      await prisma.product.delete({
        where: { uuid },
      });
    } catch (error) {
      throw this.handlePrismaError(error, 'delete');
    }
  }

  static async getBestSellers(query: { limit?: number } = {}) {
    try {
      const { limit = 10 } = query;

      const products = await prisma.product.findMany({
        where: {
          isActive: true,
        },
        orderBy: [{ averageRating: 'desc' }, { reviewCount: 'desc' }],
        take: limit,
        include: {
          category: {
            select: {
              id: true,
              uuid: true,
              name: true,
              slug: true,
            },
          },
          comments: {
            select: {
              id: true,
            },
          },
        },
      });

      return products.map(product => ({
        ...product,
        commentsCount: product.comments.length,
      }));
    } catch (error) {
      throw this.handlePrismaError(error, 'find');
    }
  }
}
