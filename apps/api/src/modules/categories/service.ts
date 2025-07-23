import { prisma } from "#core";
import { Prisma } from "#prisma/index";
import { PrismaClientKnownRequestError } from "#prisma/runtime/library";
import { NotFoundException, PaginationQuery } from "#utils";
import { CategoryCreatePayload, CategoryUpdatePayload } from "./types";

export abstract class CategoriesService {
    private static async handlePrismaError(error: unknown, context: 'find' | 'create' | 'update' | 'delete') {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Kategori bulunamadı');
            }
        }
        console.error(`Error in CategoriesService.${context}:`, error);
        throw error;
    }

    // Top sellers için helper method
    private static async getTopSellersByCategory(categoryId: number) {
        const topSellers = await prisma.product.findMany({
            where: {
                categoryId: categoryId,
                isActive: true,
            },
            orderBy: [
                { averageRating: 'desc' },
                { reviewCount: 'desc' },
            ],
            take: 3,
            select: {
                name: true,
                slug: true,
                shortDescription: true,
                primaryPhotoUrl: true,
            },
        });

        return topSellers.map(product => ({
            name: product.name,
            slug: product.slug,
            description: product.shortDescription,
            picture_src: product.primaryPhotoUrl,
        }));
    }

    static async index(query: PaginationQuery & { search?: string }) {
        try {
            const { page = 1, perPage = 20, search } = query;
            const skip = (page - 1) * perPage;

            const where: Prisma.CategoryWhereInput = {
                parentId: null, // Sadece ana kategorileri getir
                ...(search && {
                    OR: [
                        {
                            name: {
                                contains: search,
                                mode: Prisma.QueryMode.insensitive,
                            },
                        },
                        {
                            slug: {
                                contains: search,
                                mode: Prisma.QueryMode.insensitive,
                            },
                        },
                    ],
                }),
            };

            const [data, total] = await Promise.all([
                prisma.category.findMany({
                    where,
                    skip,
                    take: perPage,
                    orderBy: { order: 'asc' },
                    include: {
                        children: {
                            orderBy: { order: 'asc' },
                            include: {
                                children: {
                                    orderBy: { order: 'asc' },
                                    select: {
                                        name: true,
                                        slug: true,
                                        order: true,
                                    },
                                },
                            },
                        },
                    },
                }),
                prisma.category.count({ where }),
            ]);

            // Her ana kategori için top sellers'ı getir
            const dataWithTopSellers = await Promise.all(
                data.map(async (category) => {
                    const topSellers = await this.getTopSellersByCategory(category.id);
                    return {
                        ...category,
                        top_sellers: topSellers,
                    };
                })
            );

            return { data: dataWithTopSellers, total };
        } catch (error) {
            throw this.handlePrismaError(error, 'find');
        }
    }

    static async show(uuid: string) {
        try {
            const category = await prisma.category.findUnique({
                where: { uuid },
                include: {
                    children: {
                        orderBy: { order: 'asc' },
                        include: {
                            children: {
                                orderBy: { order: 'asc' },
                                select: {
                                    name: true,
                                    slug: true,
                                    order: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!category) {
                throw new NotFoundException('Kategori bulunamadı');
            }

            // Top sellers'ı getir
            const topSellers = await this.getTopSellersByCategory(category.id);

            return {
                ...category,
                top_sellers: topSellers,
            };
        } catch (error) {
            throw this.handlePrismaError(error, 'find');
        }
    }

    static async store(data: CategoryCreatePayload) {
        try {
            const category = await prisma.category.create({
                data: {
                    ...data,
                },
                include: {
                    children: {
                        orderBy: { order: 'asc' },
                        include: {
                            children: {
                                orderBy: { order: 'asc' },
                                select: {
                                    name: true,
                                    slug: true,
                                    order: true,
                                },
                            },
                        },
                    },
                },
            });

            // Top sellers'ı getir
            const topSellers = await this.getTopSellersByCategory(category.id);

            return {
                ...category,
                top_sellers: topSellers,
            };
        } catch (error) {
            throw this.handlePrismaError(error, 'create');
        }
    }

    static async update(uuid: string, data: CategoryUpdatePayload) {
        try {
            const category = await prisma.category.update({
                where: { uuid },
                data,
                include: {
                    children: {
                        orderBy: { order: 'asc' },
                        include: {
                            children: {
                                orderBy: { order: 'asc' },
                                select: {
                                    name: true,
                                    slug: true,
                                    order: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!category) {
                throw new NotFoundException('Kategori bulunamadı');
            }

            // Top sellers'ı getir
            const topSellers = await this.getTopSellersByCategory(category.id);

            return {
                ...category,
                top_sellers: topSellers,
            };
        } catch (error) {
            throw this.handlePrismaError(error, 'update');
        }
    }

    static async destroy(uuid: string) {
        try {
            const category = await prisma.category.delete({
                where: { uuid },
                include: {
                    children: {
                        orderBy: { order: 'asc' },
                        include: {
                            children: {
                                orderBy: { order: 'asc' },
                                select: {
                                    name: true,
                                    slug: true,
                                    order: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!category) {
                throw new NotFoundException('Kategori bulunamadı');
            }

            // Top sellers'ı getir (silinen kategori için)
            const topSellers = await this.getTopSellersByCategory(category.id);

            return {
                ...category,
                top_sellers: topSellers,
            };
        } catch (error) {
            throw this.handlePrismaError(error, 'delete');
        }
    }
}