import { Elysia } from 'elysia';
import { roleDestroyDto, roleIndexDto, roleShowDto, roleStoreDto, roleUpdateDto } from './dtos';
import { RolesService } from './service';
import { RoleFormatter } from './formatters';
import { auth, authSwagger } from '../authentication/plugin';
import { PERMISSIONS } from './constants';
import { dtoWithPermission } from '../';
import { dtoWithMiddlewares } from '../../../utils';
import { withPermission } from '../roles/middleware';
import { withAuditLog, AuditLogAction, AuditLogEntity } from '../../audit-logs';

const app = new Elysia({
    prefix: '/roles',
    detail: {
        tags: ['Role'],
    },
})
    .guard(authSwagger, (app) =>
        app
            .use(auth())
            .get(
                '',
                async ({ query }) => {
                    const roles = await RolesService.index(query);
                    const response = roles.map(RoleFormatter.response);
                    return response;
                },
                dtoWithPermission(roleIndexDto, PERMISSIONS.ROLES.SHOW),
            )
            .get(
                '/:uuid',
                async ({ params: { uuid } }) => {
                    const role = await RolesService.show({ uuid });
                    const response = RoleFormatter.response(role);
                    return response;
                },
                roleShowDto
            )
            .post(
                '',
                async ({ body }) => {
                    const role = await RolesService.store(body);
                    const response = RoleFormatter.response(role);
                    return response;
                },
                dtoWithMiddlewares(
                    roleStoreDto,
                    withPermission(PERMISSIONS.ROLES.UPDATE),
                    withAuditLog<typeof roleStoreDto>({
                        actionType: AuditLogAction.CREATE,
                        entityType: AuditLogEntity.ROLE,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        getEntityUuid: ({ response }) => (response as any).uuid,
                        getDescription: () => 'Yeni rol oluşturuldu',
                        getMetadata: ({ body }) => ({ createdFields: body }),
                    })
                ),
            )
            .patch(
                '/:uuid',
                async ({ params: { uuid }, body }) => {
                    const role = await RolesService.update(uuid, body);
                    const response = RoleFormatter.response(role);
                    return response;
                },
                dtoWithMiddlewares(
                    roleUpdateDto,
                    withPermission(PERMISSIONS.ROLES.UPDATE),
                    withAuditLog<typeof roleUpdateDto>({
                        actionType: AuditLogAction.UPDATE,
                        entityType: AuditLogEntity.ROLE,
                        getEntityUuid: ({ params }) => params.uuid,
                        getDescription: ({ body }) => `Rol güncellendi: ${Object.keys(body).join(', ')}`,
                        getMetadata: ({ body }) => ({ updatedFields: body }),
                    })
                ),
            )
            .delete(
                '/:uuid',
                async ({ params: { uuid } }) => {
                    await RolesService.destroy(uuid);
                    return { message: 'Rol silindi' };
                },
                dtoWithMiddlewares(
                    roleDestroyDto,
                    withPermission(PERMISSIONS.ROLES.UPDATE),
                    withAuditLog<typeof roleDestroyDto>({
                        actionType: AuditLogAction.DELETE,
                        entityType: AuditLogEntity.ROLE,
                        getEntityUuid: ({ params }) => params.uuid,
                        getDescription: () => 'Rol silindi',
                    })
                ),
            )
    );

export default app;
