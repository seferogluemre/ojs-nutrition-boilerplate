import { Elysia } from 'elysia';

import { dtoWithMiddlewares } from '../../utils';
import { AuditLogAction, AuditLogEntity, withAuditLog } from '../audit-logs';
import { dtoWithPermission } from '../auth';
import { auth, authSwagger } from '../auth/authentication/plugin';
import { PERMISSIONS } from '../auth/roles/constants';
import { ensureUserHasPermission } from '../auth/roles/helpers';
import { withPermission } from '../auth/roles/middleware';
import { userCreateDto, userDestroyDto, userIndexDto, userShowDto, userSignupDto, userUpdateDto } from './dtos';
import { UserFormatter } from './formatters';
import { UsersService } from './service';
import { userRolesApp } from './user-roles';

const app = new Elysia({
  prefix: '/users',
  detail: {
    tags: ['User'],
  },
})
  .use(userRolesApp)
  .post(
    '/signup', // public signup
    async ({ body }) => {
      // Varsayılan değerler ile kullanıcı oluştur
      const userData = {
        email: body.email,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName,
        gender: 'MALE', 
        rolesSlugs: ['user'], 
        isActive: true,
        imageFile: undefined,
      };
      const user = await UsersService.store(userData);
      return UserFormatter.response(user);
    },
    userSignupDto,
  )
  .guard(authSwagger, (app) =>
    app
      .use(auth())
      .post(
        '', // admin user create
        async ({ body }) => {
          const user = await UsersService.store(body);
          return UserFormatter.response(user);
        },
        dtoWithMiddlewares(
          userCreateDto,
          withPermission(PERMISSIONS.USERS.CREATE), 
          withAuditLog<typeof userCreateDto>({
            actionType: AuditLogAction.CREATE,
            entityType: AuditLogEntity.USER,
            getEntityUuid: (ctx) => {
              const response = ctx.response as ReturnType<typeof UserFormatter.response>;
              return response.id;
            },
            getDescription: () => 'Yeni kullanıcı oluşturuldu',
          }),
        ),
      )
      .get(
        '', // index
        async ({ query }) => {
          const users = await UsersService.index(query);
          const response = users.map(UserFormatter.response);
          return response;
        },
        userIndexDto,
      )
      .get(
        '/:id', // show
        async ({ params: { id }, query }) => {
          const targetUser = await UsersService.show({ id }, query?.recordStatus, query?.status);
          const response = UserFormatter.response(targetUser);
          return response;
        },
        dtoWithPermission(userShowDto, PERMISSIONS.USERS.SHOW),
      )
      .patch(
        '/:id', // update
        async ({ params: { id }, body, user }) => {
          if (user.id !== id) {
            ensureUserHasPermission(user, PERMISSIONS.USERS.UPDATE);
          }
          const updatedUser = await UsersService.update(id, body);
          const response = UserFormatter.response(updatedUser);
          return response;
        },
        dtoWithMiddlewares(
          userUpdateDto,
          withAuditLog<typeof userUpdateDto>({
            actionType: AuditLogAction.UPDATE,
            entityType: AuditLogEntity.USER,
            getEntityUuid: ({ params }) => params.id,
            getDescription: ({ body }) => `Kullanıcı güncellendi`,
          }),
        ),
      )
      .delete(
        '/:id', // destroy
        async ({ params: { id } }) => {
          await UsersService.destroy(id);
          return { message: 'Kullanıcı silindi' };
        },
        dtoWithMiddlewares(
          userDestroyDto,
          withPermission(PERMISSIONS.USERS.DESTROY),
          withAuditLog<typeof userDestroyDto>({
            actionType: AuditLogAction.DELETE,
            entityType: AuditLogEntity.USER,
            getEntityUuid: ({ params }) => params.id,
            getDescription: () => 'Kullanıcı silindi',
          }),
        ),
      ),
  );

export default app;