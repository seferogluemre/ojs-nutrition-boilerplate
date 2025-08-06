import { prisma } from '#core';
import type { AuthContext } from 'better-auth/types';
import { RolesService } from '../../../roles/service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getAdminAdapter = (context: AuthContext) => {
  return {
    findRoleBySlug: async (slug: string) => {
      const role = await RolesService.show({ slug });
      return role;
    },
    assignRoleToUser: async (userId: string, roleId: number) => {
      // user_roles tablosuna kayıt ekle
      try {
        console.log('🔄 Creating user_role record for userId:', userId, 'roleId:', roleId);
        await prisma.userRole.create({
          data: {
            userId,
            roleId,
          },
        });
        console.log('✅ user_role record created successfully');
        
        // rolesSlugs alanını güncelle
        console.log('🔄 Updating rolesSlugs for user:', userId);
        const userWithRoles = await prisma.user.findUnique({
          where: { id: userId },
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
        
        if (userWithRoles) {
          const rolesSlugs = userWithRoles.userRoles.map(ur => ur.role.slug);
          console.log('🔄 New rolesSlugs will be:', rolesSlugs);
          await prisma.user.update({
            where: { id: userId },
            data: { rolesSlugs }
          });
          console.log('✅ rolesSlugs updated successfully');
        } else {
          console.log('❌ User not found when updating rolesSlugs');
        }
      } catch (error) {
        // Zaten varsa ignore et (unique constraint)
        console.error('❌ Role assignment error:', error);
      }
    },
  };
};
