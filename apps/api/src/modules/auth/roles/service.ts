
import { cache, prisma } from '#core';
import { Role } from '#prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import slugify from 'slugify';
import { BadRequestException, ConflictException, NotFoundException } from '../../../utils';
import { filterRoles } from './dtos';
import { RoleCreatePayload, RoleIndexQuery, RoleUpdatePayload } from './types';

const ROLES_CACHE_KEY = 'roles';
const ROLE_CACHE_KEY = (slugOrUuid: string) => `role:${slugOrUuid}`;

export abstract class RolesService {
    private static async clearCache() {
        await cache.del(ROLES_CACHE_KEY);
        const keys = await cache.keys('role:*');
        if (keys.length > 0) {
            await cache.del(keys);
        }
    }

    private static generateSlug(name: string): string {
        return slugify(name, {
            lower: true,
            strict: true
        });
    }

    private static async syncUsersRolesSlugs(roleId: number) {
        // Rolü kullanan tüm kullanıcıları bul
        const usersWithRole = await prisma.userRole.findMany({
            where: { roleId },
            select: { userId: true }
        });

        if (usersWithRole.length === 0) return;

        const userIds = usersWithRole.map(ur => ur.userId);

        // Her kullanıcı için güncel rolesSlugs listesini oluştur
        await prisma.$transaction(async (tx) => {
            const usersWithRoles = await tx.user.findMany({
                where: { id: { in: userIds } },
                include: {
                    userRoles: {
                        include: {
                            role: {
                                select: { slug: true }
                            }
                        }
                    }
                }
            });

            // Batch update için promises dizisi
            const updatePromises = usersWithRoles.map(user =>
                tx.user.update({
                    where: { id: user.id },
                    data: {
                        rolesSlugs: user.userRoles.map(ur => ur.role.slug)
                    }
                })
            );

            await Promise.all(updatePromises);
        });
    }

    static async index(query?: RoleIndexQuery) {
        const cachedRoles = await cache.get<Role[]>(ROLES_CACHE_KEY);
        let roles: Role[];

        if (cachedRoles) {
            roles = cachedRoles;
        } else {
            roles = await prisma.role.findMany({
                orderBy: { createdAt: 'asc' }
            });
            await cache.set(ROLES_CACHE_KEY, roles, 3600); // 1 saat cache
        }

        if (!query) {
            return roles;
        }

        const result = filterRoles(roles, query);

        return result;
    }

    static async show({ uuid, slug }: { uuid?: string, slug?: string }) {
        if (uuid) {
            const cachedRole = await cache.get<Role>(ROLE_CACHE_KEY(uuid));
            if (cachedRole) {
                return cachedRole;
            }
        }

        if (slug) {
            const cachedRole = await cache.get<Role>(ROLE_CACHE_KEY(slug));
            if (cachedRole) {
                return cachedRole;
            }
        }

        const role = await prisma.role.findUnique({
            where: { uuid, slug },
        });

        if (!role) {
            throw new NotFoundException('Rol bulunamadı');
        }

        await cache.set(ROLE_CACHE_KEY(role.slug), role, 3600); // 1 saat cache
        await cache.set(ROLE_CACHE_KEY(role.uuid), role, 3600); // 1 saat cache
        return role;
    }

    static async store(payload: RoleCreatePayload) {
        try {
            if (payload.permissions?.includes('*') && payload.permissions.length > 1) {
                throw new BadRequestException('Wildcard (*) yetkisi tek başına kullanılmalıdır');
            }

            const slug = payload.slug ?? this.generateSlug(payload.name);

            const role = await prisma.role.create({
                data: {
                    name: payload.name,
                    slug,
                    description: payload.description,
                    permissions: payload.permissions,
                },
            });

            await this.clearCache();
            return role;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('Bu rol adı zaten kullanılıyor');
                }
            }
            throw error;
        }
    }

    static async update(uuid: string, payload: RoleUpdatePayload) {
        try {
            const role = await prisma.role.findUnique({
                where: { uuid },
                select: {
                    id: true,
                    name: true,
                    userRoles: { select: { id: true } },
                },
            });

            if (!role) {
                throw new NotFoundException('Rol bulunamadı');
            }

            if (
                role.id === 1 &&
                (Array.isArray(payload.permissions) || payload.permissions === null)
            ) {
                throw new BadRequestException('Admin rolünün yetkileri değiştirilemez');
            }

            const slug = payload.name ? this.generateSlug(payload.name) : undefined;

            const updatedRole = await prisma.role.update({
                where: { uuid },
                data: {
                    name: payload.name,
                    slug,
                    description: payload.description,
                    permissions: payload.permissions,
                },
            });

            // Role değişikliğinde kullanıcıların rolesSlugs'larını güncelle
            await this.syncUsersRolesSlugs(role.id);
            await this.clearCache();
            return updatedRole;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException('Rol bulunamadı');
                }
            }
            throw error;
        }
    }

    static async destroy(uuid: string) {
        try {
            const role = await prisma.role.findUnique({
                where: { uuid },
                select: {
                    id: true,
                    userRoles: { select: { id: true } },
                },
            });

            if (!role) {
                throw new NotFoundException('Rol bulunamadı');
            }

            if (role.id === 1) {
                throw new BadRequestException('Admin rolü silinemez');
            }

            // Role silinmeden önce kullanıcıların rolesSlugs'larını güncelle
            await this.syncUsersRolesSlugs(role.id);

            await prisma.role.delete({
                where: { uuid },
            });

            await this.clearCache();
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException('Rol bulunamadı');
                }
            }
            throw error;
        }
    }
}
