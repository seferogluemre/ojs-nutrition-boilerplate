import prisma from '#core/prisma';
import { NotFoundException } from '../../../utils';
import { UserRoleUpdatePayload } from './types';


export abstract class UserRolesService {
    static async update(id: string, payload: UserRoleUpdatePayload["rolesSlugs"]) {
        return await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { id },
                include: {
                    userRoles: true,
                },
            });

            if (!user) {
                throw new NotFoundException('Kullanıcı bulunamadı');
            }

            let rolesSlugs: string[] = [];

            await tx.userRole.deleteMany({
                where: {
                    userId: user.id,
                },
            });

            if (payload.length > 0) {
                const roles = await tx.role.findMany({
                    where: {
                        slug: {
                            in: payload,
                        },
                    },
                    select: {
                        id: true,
                        slug: true,
                    },
                });

                if (roles.length !== payload.length) {
                    const notFoundRoles = payload.filter((slug) => !roles.some((role) => role.slug === slug));
                    throw new NotFoundException(`Rol bulunamadı: ${notFoundRoles.join(', ')}`);
                }

                await tx.userRole.createMany({
                    data: roles.map((role) => ({
                        userId: user.id,
                        roleId: role.id,
                    })),
                });

                rolesSlugs = roles.map((role) => role.slug);
            }

            const uniqueSlugs = [...new Set(rolesSlugs)];

            const updatedUser = await tx.user.update({
                where: { id },
                data: {
                    rolesSlugs: uniqueSlugs,
                },
                include: {
                    userRoles: {
                        include: {
                            role: true,
                        },
                    },
                },
            });

            return updatedUser;
        });
    }
}
