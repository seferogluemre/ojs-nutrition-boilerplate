import { Elysia } from 'elysia';

import { NotFoundException, dtoWithMiddlewares } from '../../utils';
import { PaginationService } from '../../utils/pagination';
import { AuditLogAction, AuditLogEntity, withAuditLog } from '../audit-logs';
import { PERMISSIONS, withPermission } from '../auth';
import { auth, authSwagger } from '../auth/authentication/plugin';
import {
  categoryCreateDto,
  categoryDestroyDto,
  categoryIndexDto,
  categoryShowDto,
  categoryUpdateDto,
} from './dtos';
import { CategoryFormatter } from './formatters';
import { CategoriesService } from './service';

const app = new Elysia({ prefix: '/categories', tags: ['Category'] })
  .get(
    '/',
    async ({ query }) => {
      const { data, total } = await CategoriesService.index(query);
      return PaginationService.createPaginatedResponse({
        data,
        total,
        query,
        formatter: CategoryFormatter.response,
      });
    },
    categoryIndexDto,
  )
  .get(
    '/:uuid',
    async ({ params }) => {
      const category = await CategoriesService.show(params.uuid);
      if (!category) throw new NotFoundException('Kategori bulunamadı');
      return CategoryFormatter.response(category);
    },
    categoryShowDto,
  )
  .guard(authSwagger, (app) =>
    app
      .use(auth())
      .post(
        '/',
        async ({ body }) => {
          const category = await CategoriesService.store(body);
          return CategoryFormatter.response(category);
        },
        dtoWithMiddlewares(
          categoryCreateDto,
          withPermission(PERMISSIONS.CATEGORIES.CREATE),
          withAuditLog<typeof categoryCreateDto>({
            actionType: AuditLogAction.CREATE,
            entityType: AuditLogEntity.PRODUCT,
            getDescription: ({ body }) => `Kategori oluşturuldu: ${body.name}`,
            getEntityUuid: ({ body }) => body.id,
          }),
        ),
      )
      .put(
        '/:uuid',
        async ({ params, body }) => {
          const category = await CategoriesService.update(params.uuid, body);
          if (!category) throw new NotFoundException('Kategori bulunamadı');
          return CategoryFormatter.response(category);
        },
        dtoWithMiddlewares(
          categoryUpdateDto,
          withPermission(PERMISSIONS.CATEGORIES.UPDATE),
          withAuditLog<typeof categoryUpdateDto>({
            actionType: AuditLogAction.CREATE,
            entityType: AuditLogEntity.PRODUCT,
            getDescription: ({ body }) => `Kategori güncellendi: ${body.name}`,
            getEntityUuid: ({ body }) => body.id,
          }),
        ),
      )
      .delete(
        '/:uuid',
        async ({ params }) => {
          const category = await CategoriesService.destroy(params.uuid);
          if (!category) throw new NotFoundException('Kategori bulunamadı');
          return { message: 'Kategori başarıyla silindi' };
        },
        dtoWithMiddlewares(
          categoryDestroyDto,
          withPermission(PERMISSIONS.CATEGORIES.DESTROY),
          withAuditLog<typeof categoryDestroyDto>({
            actionType: AuditLogAction.DELETE,
            entityType: AuditLogEntity.PRODUCT,
            getDescription: ({ params }) => `Kategori silindi: ${params.uuid}`,
            getEntityUuid: ({ params }) => params.uuid,
          }),
        ),
      ),
  );

export default app;
