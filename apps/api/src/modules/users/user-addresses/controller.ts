import { auth } from '#modules/auth/authentication/plugin.ts';
import { Elysia } from 'elysia';


import { AuditLogAction, AuditLogEntity } from '#modules/audit-logs/constants.ts';
import { withAuditLog } from '#modules/audit-logs/middleware.ts';
import { PERMISSIONS, withPermission } from '#modules/auth/index.ts';
import { dtoWithMiddlewares } from '#utils/middleware-utils.ts';
import {
  userAddressCreateDto,
  userAddressDestroyDto,
  userAddressIndexDto,
  userAddressShowDto,
  userAddressUpdateDto
} from './dtos';
import { UserAddressFormatter } from './formatters';
import { UserAddressesService } from './service';

// @ts-ignore - Complex middleware composition causes deep type instantiation
const app = new Elysia({
  prefix: '/user-addresses',
  detail: {
    tags: ['UserAddress'],
  },
})
  .use(auth()) 
  .post(
    '', 
    async ({ body, user }) => {
      const userAddress = await UserAddressesService.store({
        ...body,
        userId: user.id,
      });
      return UserAddressFormatter.response(userAddress);
    },
    // @ts-ignore - Complex middleware composition
    dtoWithMiddlewares(
      userAddressCreateDto,
      withPermission(PERMISSIONS.USER_ADDRESSES.CREATE),
      withAuditLog<typeof userAddressCreateDto>({
        actionType: AuditLogAction.CREATE,
        entityType: AuditLogEntity.USER,
        getEntityUuid: (ctx) => {
          const response = ctx.response as ReturnType<typeof UserAddressFormatter.response>;
          return String(response.id);
        },
        getDescription: () => 'Yeni kullanıcı adresi oluşturuldu',
      })
    ),
  )
  .get(
    '', 
    async ({ user }) => {
      const userAddresses = await UserAddressesService.index({ userId: user.id });
      const response = userAddresses.map(UserAddressFormatter.response);
      return response;
    },  
    dtoWithMiddlewares(
      userAddressIndexDto,
      withPermission(PERMISSIONS.USER_ADDRESSES.INDEX),
      withAuditLog<typeof userAddressIndexDto>({
        actionType: AuditLogAction.CREATE,
        entityType: AuditLogEntity.USER,
        getEntityUuid: () => 'Kullanıcı adresi',
        getDescription: () => 'Kullanıcı adresleri görüntülendi',
      }),
    ),
  )
  .get(
    '/:id', 
    async ({ params: { id }, user }) => {
      const userAddress = await UserAddressesService.show({ 
        id: id,
        userId: user.id 
      });
      const response = UserAddressFormatter.response(userAddress);
      return response;
    },
    dtoWithMiddlewares(
      userAddressShowDto,
      withPermission(PERMISSIONS.USER_ADDRESSES.SHOW),
      withAuditLog<typeof userAddressShowDto>({
        actionType: AuditLogAction.CREATE,
        entityType: AuditLogEntity.USER,
        getEntityUuid: ({ params }) => params.id,
        getDescription: () => 'Kullanıcı adresi görüntülendi',
      }),
    ),
  )
  .patch(
    '/:id', 
    async ({ params: { id }, body, user }) => {
      const updatedUserAddress = await UserAddressesService.update(id, body);
      
      const response = UserAddressFormatter.response(updatedUserAddress);
      return response;
    },
    dtoWithMiddlewares(
      userAddressUpdateDto,
      withAuditLog({
        actionType: AuditLogAction.UPDATE,
        entityType: AuditLogEntity.USER,
        getEntityUuid: ({ params }: any) => params.id.toString(),
        getDescription: () => 'Kullanıcı adresi güncellendi',
      }),
    ),  
  )
  .delete(
    '/:id', 
    async ({ params: { id }, user }) => {
      await UserAddressesService.show({ 
        id: id,
        userId: user.id,
      });
      
      await UserAddressesService.destroy(id);
      return { message: 'Kullanıcı adresi silindi' };
    },
    // @ts-ignore - Complex middleware composition
    dtoWithMiddlewares(
      userAddressDestroyDto,
      withAuditLog({
        actionType: AuditLogAction.DELETE,
        entityType: AuditLogEntity.USER,
        getEntityUuid: ({ params }: any) => params.id.toString(),
        getDescription: () => 'Kullanıcı adresi silindi',
      }),
    ),
  );

export default app; 