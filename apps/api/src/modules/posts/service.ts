
import { prisma } from '#core';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NotFoundException } from '../../utils';
import { PaginationQuery } from '../../utils/pagination';
import { PostCreatePayload, PostUpdatePayload } from './types';

export abstract class PostsService {
    private static async handlePrismaError(error: unknown, context: 'find' | 'create' | 'update' | 'delete') {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Gönderi bulunamadı');
            }
        }
        console.error(`Error in PostsService.${context}:`, error);
        throw error;
    }

    static async index(query: PaginationQuery & { search?: string }) {
        try {
            const { page = 1, perPage = 20, search } = query;
            const skip = (page - 1) * perPage;

            const where: Prisma.PostWhereInput = search
                ? {
                    OR: [
                        {
                            title: {
                                contains: search,
                                mode: Prisma.QueryMode.insensitive,
                            },
                        },
                        {
                            content: {
                                contains: search,
                                mode: Prisma.QueryMode.insensitive,
                            },
                        },
                    ],
                }
                : {};

            const [data, total] = await Promise.all([
                prisma.post.findMany({
                    where,
                    skip,
                    take: perPage,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                }),
                prisma.post.count({ where }),
            ]);

            return { data, total };
        } catch (error) {
            throw this.handlePrismaError(error, 'find');
        }
    }

    static async show(uuid: string) {
        try {
            const post = await prisma.post.findUnique({
                where: { uuid },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });

            if (!post) {
                throw new NotFoundException('Gönderi bulunamadı');
            }

            return post;
        } catch (error) {
            throw this.handlePrismaError(error, 'find');
        }
    }

    static async store(data: PostCreatePayload, authorId: string) {
        try {
            return await prisma.post.create({
                data: {
                    ...data,
                    authorId,
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
        } catch (error) {
            throw this.handlePrismaError(error, 'create');
        }
    }

    static async update(uuid: string, data: PostUpdatePayload) {
        try {
            const post = await prisma.post.update({
                where: { uuid },
                data,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
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
            const post = await prisma.post.delete({
                where: { uuid },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });

            if (!post) {
                throw new NotFoundException('Gönderi bulunamadı');
            }

            return post;
        } catch (error) {
            throw this.handlePrismaError(error, 'delete');
        }
    }
}
