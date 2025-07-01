import { Elysia } from 'elysia';
import { dtoWithMiddlewares, ForbiddenException } from '../../../utils';
import { AuditLogAction, AuditLogEntity, withAuditLog } from '../../audit-logs';
import { auth, authSwagger } from '../../auth/authentication/plugin';
import { PERMISSIONS } from '../../auth/roles/constants';
import { ensureUserHasPermission } from '../../auth/roles/helpers';
import { UserFormatter } from '../formatters';
import { userRoleUpdateDto } from './dtos';
import { UserRolesService } from './service';

const app = new Elysia()
    .guard(authSwagger, (app) =>
        app
            .use(auth())
            .patch(
                '/:id/roles',
                async ({ params: { id }, body, user }) => {
                    if (user.id !== id) {
                        ensureUserHasPermission(user, PERMISSIONS.USERS.UPDATE);
                    } else {
                        throw new ForbiddenException('Kendi rolünüzü güncelleyemezsiniz');
                    }

                    if (body.rolesSlugs !== undefined) {
                        ensureUserHasPermission(user, PERMISSIONS.USERS.UPDATE_ROLES);
                    }

                    const updatedUser = await UserRolesService.update(id, body.rolesSlugs);
                    const response = UserFormatter.response(updatedUser);
                    return response;
                },
                dtoWithMiddlewares(
                    userRoleUpdateDto,
                    withAuditLog<typeof userRoleUpdateDto>({
                        actionType: AuditLogAction.UPDATE,
                        entityType: AuditLogEntity.USER,
                        getEntityUuid: ({ params }) => params.id,
                        getDescription: ({ body }) => `Kullanıcı rolleri güncellendi: ${body.rolesSlugs.join(', ')}`,
                        getMetadata: ({ body }) => ({ updatedFields: body }),
                    })
                ),
            )
    );

export default app;
