import { prisma } from '#core';

import { GoneException } from '../../utils';
import { COURIER_PERMISSIONS } from '../auth';
import { betterAuth } from '../auth/authentication/instance';
import { RolesService } from '../auth/roles/service';

export class SystemAdministrationService {
  static async setupInitialUser() {
    const usersCount = await prisma.user.count();

    if (usersCount > 0) {
      throw new GoneException('Halihazırda bir kullanıcı olduğu için kullanıcı kaydı yapılamaz');
    }

    let adminRole = await prisma.role.findFirst({
      where: { name: 'Admin' },
    });

    if (!adminRole) {
      adminRole = await RolesService.store({
        name: 'Admin',
        description: 'Sistem yöneticisi',
        permissions: ['*'], // Tüm yetkiler
      });
    }

    let basicRole = await prisma.role.findFirst({
      where: { name: 'Moderator' },
    });

    if (!basicRole) {
      basicRole = await RolesService.store({
        name: 'Moderator',
        description: 'İçerik moderatörü',
        permissions: [
          'products:create',
          'products:update',
          'products:index',
          'products:show',
          'products:destroy',
          'categories:create',
          'categories:destroy',
          'categories:update',
          'categories:index',
        ],
      });
    }

    let courierRole = await prisma.role.findFirst({
      where: { name: 'Courier' },
    });

    if (!courierRole) {
      courierRole = await RolesService.store({
        name: 'Courier',
        description: 'Kargo kuryesi',
        permissions: COURIER_PERMISSIONS,
      });
    }

    const signUpResult = await betterAuth.api.signUpEmail({
      body: {
        email: 'admin@example.com',
        password: '12345678',
        firstName: 'Admin',
        lastName: 'User',
        name: 'Admin User',
      },
    });

    const user = await prisma.user.update({
      where: { id: signUpResult.user.id },
      data: {
        gender: 'MALE',
        rolesSlugs: [adminRole.slug],
      },
    });

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
