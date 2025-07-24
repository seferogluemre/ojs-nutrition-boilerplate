import { Elysia } from 'elysia';

import { NotFoundException } from '../../utils';
import { PaginationService } from '../../utils/pagination';
import { PERMISSIONS, dtoWithPermission } from '../auth';
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
        dtoWithPermission(categoryCreateDto, PERMISSIONS.CATEGORIES.CREATE),
      )
      .put(
        '/:uuid',
        async ({ params, body }) => {
          const category = await CategoriesService.update(params.uuid, body);
          if (!category) throw new NotFoundException('Kategori bulunamadı');
          return CategoryFormatter.response(category);
        },
        dtoWithPermission(categoryUpdateDto, PERMISSIONS.CATEGORIES.UPDATE),
      )
      .delete(
        '/:uuid',
        async ({ params }) => {
          const category = await CategoriesService.destroy(params.uuid);
          if (!category) throw new NotFoundException('Kategori bulunamadı');
          return { message: 'Kategori başarıyla silindi' };
        },
        dtoWithPermission(categoryDestroyDto, PERMISSIONS.CATEGORIES.DESTROY),
      ),
  );

export default app;
