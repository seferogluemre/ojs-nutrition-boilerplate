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

    static async index(query: PaginationQuery & { search?: string }) {
        try {
            const { page = 1, perPage = 20, search } = query;
            const skip = (page - 1) * perPage;

            const where: Prisma.CategoryWhereInput = search
                ? {
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
                }
                : {};

            const [data, total] = await Promise.all([
                prisma.category.findMany({
                    where,
                    skip,
                    take: perPage,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        products: {
                            select: {
                                id: true,
                                name: true,
                                photos: {
                                    select: {
                                        id: true,
                                        url: true,
                                    },
                                },
                            },
                        },
                    },
                }),
                prisma.category.count({ where }),
            ]);

            return { data, total };
        } catch (error) {
            throw this.handlePrismaError(error, 'find');
        }
    }

    static async show(uuid: string) {
        try {
            const category = await prisma.category.findUnique({
                where: { uuid },
                include: {
                    products: {
                        select: {
                            id: true,
                            name: true,
                            photos: {
                                select: {
                                    id: true,
                                    url: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!category) {
                throw new NotFoundException('Kategori bulunamadı');
            }

            return category;
        } catch (error) {
            throw this.handlePrismaError(error, 'find');
        }
    }

    static async store(data: CategoryCreatePayload) {
        try {
            return await prisma.category.create({
                data: {
                    ...data,
                },
                include: {
                    products: {
                        select: {
                            id: true,
                            name: true,
                            photos: {
                                select: {
                                    id: true,
                                    url: true,
                                },
                            },
                        }
                    },
                },
            });
        } catch (error) {
            throw this.handlePrismaError(error, 'create');
        }
    }

    static async update(uuid: string, data: CategoryUpdatePayload) {
        try {
            const post = await prisma.category.update({
                where: { uuid },
                data,
                include: {
                    products: {
                        select: {
                            id: true,
                            name: true,
                            photos: {
                                select: {
                                    id: true,
                                    url: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!post) {
                throw new NotFoundException('Gönderi bulunamadı');
            }

            return post;
        } catch (error) {
            throw this.handlePrismaError(error, 'update');
        }
    }

    static async destroy(uuid: string) {
        try {
            const category = await prisma.category.delete({
                where: { uuid },
                include: {
                    products: {
                        select: {
                            id: true,
                            name: true,
                            photos: {
                                select: {
                                    id: true,
                                    url: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!category) {
                throw new NotFoundException('Kategori bulunamadı');
            }

            return category;
        } catch (error) {
            throw this.handlePrismaError(error, 'delete');
        }
    }
}