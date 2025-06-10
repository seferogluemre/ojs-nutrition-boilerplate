import { RolesService } from '../auth/roles/service';
import { UsersService } from '../users';
import { GoneException } from '../../utils';
import { prisma } from '#core';
import { Gender } from '#prisma/client';

export class SystemAdministrationService {
    static async setupInitialUser() {
        const usersCount = await prisma.user.count();

        if (usersCount > 0) {
            throw new GoneException(
                'Halihazırda bir kullanıcı olduğu için kullanıcı kaydı yapılamaz',
            );
        }

        // Admin rolünü oluştur
        const adminRole = await RolesService.store({
            name: 'Admin',
            description: 'Sistem yöneticisi',
            permissions: ['*'], // Tüm yetkiler
        });

        await RolesService.store({
            name: 'Basic',
            description: 'Temel kullanıcı',
            permissions: [],
        });

        // Admin kullanıcısını oluştur
        const user = await UsersService.store({
            password: 'password',
            email: 'admin@example.com',
            firstName: 'Admin',
            lastName: 'User',
            rolesSlugs: [adminRole.slug],
            gender: Gender.MALE,
        });

        return {
            user,
        };
    }
}
