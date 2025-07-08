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

  private static buildWhereClause(query: ProductIndexQuery): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {};

    if (query.categoryId) where.categoryId = query.categoryId;
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

      const where = this.buildWhereClause(query);
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
          },
        }),
        prisma.product.count({ where }),
      ]);

      // Format products with empty arrays for missing relations
      const formattedData = data.map((product) => ({
        ...product,
        photos: [],
        productVariants: [],
        comments: [],
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
      const product = await prisma.product.findUnique({
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
        },
      });

      if (!product) {
        throw new NotFoundException('Ürün bulunamadı');
      }

      return {
        ...product,
        photos: [],
        productVariants: [],
        comments: [],
      } as unknown as ProductWithRelations;
    } catch (error) {
      throw this.handlePrismaError(error, 'find');
    }
  }

  static async store(data: ProductCreatePayload): Promise<ProductWithRelations> {
    try {
      const product = await prisma.product.create({
        data,
        include: {
          category: {
            select: {
              id: true,
              uuid: true,
              name: true,
              slug: true,
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
      const product = await prisma.product.update({
        where: { uuid },
        data,
        include: {
          category: {
            select: {
              id: true,
              uuid: true,
              name: true,
              slug: true,
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
}
