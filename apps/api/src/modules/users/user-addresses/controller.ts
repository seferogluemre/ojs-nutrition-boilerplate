import { auth } from '#modules/auth/authentication/plugin.ts';
import { Elysia } from 'elysia';


import { AuditLogAction, AuditLogEntity } from '#modules/audit-logs/constants.ts';
import { withAuditLog } from '#modules/audit-logs/middleware.ts';
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
    ),
  )
  .get(
    '', 
    async ({ user }) => {
      const userAddresses = await UserAddressesService.index({ userId: user.id });
      const response = userAddresses.map(UserAddressFormatter.response);
      return response;
    },
    userAddressIndexDto,
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
    userAddressShowDto,
  )
  .patch(
    '/:id', 
    async ({ params: { id }, body, user }) => {
      const existingAddress = await UserAddressesService.show({ 
        id: id,
        userId: user.id 
      });
      
      const updatedUserAddress = await UserAddressesService.update(id, body);
      
      const response = UserAddressFormatter.response(updatedUserAddress);
      return response;
    },
    // @ts-ignore - Complex middleware composition
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