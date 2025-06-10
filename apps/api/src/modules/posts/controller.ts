import { Elysia } from 'elysia';
import { NotFoundException } from '../../utils';
import { PaginationService } from '../../utils/pagination';
import { auth } from '../auth/authentication/plugin';
import { PERMISSIONS } from '../auth/roles/constants';
import { withPermission } from '../auth/roles/middleware';
import { withAuditLog, AuditLogAction, AuditLogEntity } from '../audit-logs';
import { dtoWithMiddlewares } from '../../utils';
import {
    postCreateDto,
    postDestroyDto,
    postIndexDto,
    postShowDto,
    postUpdateDto,
} from './dtos';
import { PostFormatter } from './formatters';
import { PostsService } from './service';

const app = new Elysia({ prefix: '/posts', tags: ['Post'] })
    .get(
        '/',
        async ({ query }) => {
            const { data, total } = await PostsService.index(query);
            return PaginationService.createPaginatedResponse({
                data,
                total,
                query,
                formatter: PostFormatter.response,
            });
        },
        postIndexDto,
    )
    .get(
        '/:uuid',
        async ({ params }) => {
            const post = await PostsService.show(params.uuid);
            if (!post) throw new NotFoundException('Gönderi bulunamadı');
            return PostFormatter.response(post);
        },
        postShowDto,
    )
    .use(auth())
    .post(
        '/',
        async ({ body, user }) => {
            const post = await PostsService.store(body, user.id);
            return PostFormatter.response(post);
        },
        dtoWithMiddlewares(
            postCreateDto,
            withPermission(PERMISSIONS.POSTS.CREATE),
            withAuditLog({
                actionType: AuditLogAction.CREATE,
                entityType: AuditLogEntity.POST,
                getEntityUuid: (ctx) => {
                    const response = ctx.response as ReturnType<typeof PostFormatter.response>;
                    return response.uuid;
                },
                getDescription: () => 'Yeni gönderi oluşturuldu',
            }),
        ),
    )
    .put(
        '/:uuid',
        async ({ params, body }) => {
            const post = await PostsService.update(params.uuid, body);
            if (!post) throw new NotFoundException('Gönderi bulunamadı');
            return PostFormatter.response(post);
        },
        dtoWithMiddlewares(
            postUpdateDto,
            withPermission(PERMISSIONS.POSTS.UPDATE),
            withAuditLog({
                actionType: AuditLogAction.UPDATE,
                entityType: AuditLogEntity.POST,
                getEntityUuid: ({ params }) => params.uuid,
                getDescription: ({ body }) => `Gönderi güncellendi: ${Object.keys(body as object).join(', ')}`,
                getMetadata: ({ body }) => ({ updatedFields: body }),
            }),
        ),
    )
    .delete(
        '/:uuid',
        async ({ params }) => {
            const post = await PostsService.destroy(params.uuid);
            if (!post) throw new NotFoundException('Gönderi bulunamadı');
            return { message: 'Gönderi başarıyla silindi' };
        },
        dtoWithMiddlewares(
            postDestroyDto,
            withPermission(PERMISSIONS.POSTS.DESTROY),
            withAuditLog({
                actionType: AuditLogAction.DELETE,
                entityType: AuditLogEntity.POST,
                getEntityUuid: ({ params }) => params.uuid,
                getDescription: () => 'Gönderi silindi',
            }),
        ),
    );

export default app;
