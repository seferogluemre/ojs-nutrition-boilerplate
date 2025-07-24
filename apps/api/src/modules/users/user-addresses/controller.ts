import { Elysia } from 'elysia';

import { AuditLogAction, AuditLogEntity, withAuditLog } from '#modules/audit-logs';
import { auth } from '#modules/auth/authentication/plugin';
import { dtoWithMiddlewares } from '#utils';
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
    '', // create user address
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
      withAuditLog({
        actionType: AuditLogAction.CREATE,
        entityType: AuditLogEntity.USER,
        getEntityUuid: (ctx: any) => {
          const response = ctx.response as ReturnType<typeof UserAddressFormatter.response>;
          return response.uuid;
        },
        getDescription: () => 'Yeni kullanıcı adresi oluşturuldu',
      }),
    ),
  )
  .get(
    '', // index
    async ({ query, user }) => {
      const queryWithUser = {
        ...query,
        userId: user.id, // Kullanıcı sadece kendi adreslerini görebilir
      };
      const userAddresses = await UserAddressesService.index(queryWithUser);
      const response = userAddresses.map(UserAddressFormatter.response);
      return response;
    },
    userAddressIndexDto,
  )
  .get(
    '/:id', // show
    async ({ params: { id }, user }) => {
      const userAddress = await UserAddressesService.show({ 
        id: parseInt(id.toString()),
        userId: user.id, 
      });
      const response = UserAddressFormatter.response(userAddress);
      return response;
    },
    userAddressShowDto,
  )
  .patch(
    '/:id', // update
    async ({ params: { id }, body, user }) => {
      // Önce adresin kullanıcıya ait olduğunu kontrol et
      await UserAddressesService.show({ 
        id: parseInt(id.toString()),
        userId: user.id,
      });
      
      const updatedUserAddress = await UserAddressesService.update(id.toString(), body);
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
    '/:id', // destroy
    async ({ params: { id }, user }) => {
      // Önce adresin kullanıcıya ait olduğunu kontrol et
      await UserAddressesService.show({ 
        id: parseInt(id.toString()),
        userId: user.id,
      });
      
      await UserAddressesService.destroy(id.toString());
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