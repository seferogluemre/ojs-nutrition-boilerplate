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

    // Parent-child validation helper methods
    private static async validateParentCategory(parentId?: string) {
        if (!parentId) return null;

        const parent = await prisma.category.findUnique({
            where: { uuid: parentId },
            include: {
                parent: true,
            },
        });

        if (!parent) {
            throw new NotFoundException('Parent kategori bulunamadı');
        }

        return parent;
    }

    private static async validateCategoryDepth(parentId?: string) {
        if (!parentId) return 0; // Ana kategori

        let depth = 0;
        let currentParentId = parentId;

        while (currentParentId && depth < 3) {
            const parent = await prisma.category.findUnique({
                where: { uuid: currentParentId },
                select: { parentId: true, parent: { select: { uuid: true } } },
            });

            if (!parent) break;
            depth++;
            currentParentId = parent.parent?.uuid;
        }

        if (depth >= 3) {
            throw new Error('Maksimum 3 seviye kategori derinliği desteklenir');
        }

        return depth + 1;
    }

    private static async validateCircularReference(categoryUuid: string, newParentId?: string) {
        if (!newParentId) return;

        if (categoryUuid === newParentId) {
            throw new Error('Kategori kendisini parent olarak seçemez');
        }

        // Check if new parent is a child of current category
        const currentCategory = await prisma.category.findUnique({
            where: { uuid: categoryUuid },
            select: { id: true },
        });

        if (!currentCategory) return;

        const isChild = await prisma.category.findFirst({
            where: {
                uuid: newParentId,
                OR: [
                    { parentId: currentCategory.id },
                    {
                        parent: {
                            parentId: currentCategory.id,
                        },
                    },
                ],
            },
        });

        if (isChild) {
            throw new Error('Circular reference oluşturulamaz - seçilen parent bu kategorinin alt kategorisidir');
        }
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
            // Parent validation
            const parent = await this.validateParentCategory(data.parentId);
            
            // Depth validation
            await this.validateCategoryDepth(data.parentId);

            const category = await prisma.category.create({
                data: {
                    name: data.name,
                    slug: data.slug,
                    order: data.order || 0,
                    parentId: parent ? parent.id : null, // UUID'den integer ID'ye çevir
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
            // Mevcut kategoriyi kontrol et
            const existingCategory = await prisma.category.findUnique({
                where: { uuid },
            });

            if (!existingCategory) {
                throw new NotFoundException('Kategori bulunamadı');
            }

            // Parent validation (eğer parentId güncelleniyor ise)
            const parent = await this.validateParentCategory(data.parentId);
            
            // Circular reference validation
            await this.validateCircularReference(uuid, data.parentId);
            
            // Depth validation
            await this.validateCategoryDepth(data.parentId);

            const category = await prisma.category.update({
                where: { uuid },
                data: {
                    name: data.name,
                    slug: data.slug,
                    order: data.order,
                    parentId: parent ? parent.id : (data.parentId === undefined ? undefined : null),
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