import { prisma } from '#core';
import { GoneException } from '../../utils';
import { betterAuth } from '../auth/authentication/instance';
import { RolesService } from '../auth/roles/service';

export class SystemAdministrationService {
    static async setupInitialUser() {
        const usersCount = await prisma.user.count();

        if (usersCount > 0) {
            throw new GoneException(
                'Halihazırda bir kullanıcı olduğu için kullanıcı kaydı yapılamaz',
            );
        }

        // Admin rolünü oluştur veya mevcut olanı getir
        let adminRole = await prisma.role.findFirst({
            where: { name: 'Admin' }
        });

        if (!adminRole) {
            adminRole = await RolesService.store({
                name: 'Admin',
                description: 'Sistem yöneticisi',
                permissions: ['*'], // Tüm yetkiler
            });
        }

        // Basic rolünü oluştur veya mevcut olanı getir
        let basicRole = await prisma.role.findFirst({
            where: { name: 'Basic' }
        });

        if (!basicRole) {
            basicRole = await RolesService.store({
                name: 'Basic',
                description: 'Temel kullanıcı',
                permissions: [],
            });
        }

        // Admin kullanıcısını oluştur
        const signUpResult = await betterAuth.api.signUpEmail({
            body: {
                email: 'admin@example.com',
                password: '12345678',
                firstName: 'Admin',
                lastName: 'User',
                name: 'Admin User',
            },
        });

        // Kullanıcıyı gender ve role bilgileri ile güncelleyelim
        const user = await prisma.user.update({
            where: { id: signUpResult.user.id },
            data: {
                gender: "MALE",
                rolesSlugs: [adminRole.slug],
            },
        });

        // UserRole tablosunu da güncelle
        await prisma.userRole.create({
            data: {
                userId: user.id,
                roleId: adminRole.id,
            },
        });

        return {
            user,
        };
    }

    static async debugUsers() {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                emailVerified: true,
                isActive: true,
                rolesSlugs: true,
                createdAt: true,
                deletedAt: true,
            },
        });

        return users;
    }
}
