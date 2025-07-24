import { Elysia } from 'elysia';

import { auth } from '#modules/auth/authentication/plugin';
import { commentCreateDto, commentIndexDto } from './dto';
import { ProductCommentFormatter } from './formatter';
import { ProductCommentService } from './service';

export const app = new Elysia({
  prefix: '/products/:id/comments',
  detail: {
    tags: ['Product Comments'],
  },
})

  .get(
    '',
    async ({ params, query }) => {
      const offset = query.offset || 0;
      const limit = query.limit || 10;
      const page = Math.floor(offset / limit) + 1;

      const { data, total } = await ProductCommentService.getComments({
        productId: params.id,
        page,
        limit,
      });

      return {
        data: ProductCommentFormatter.list(data),
        meta: {
          limit,
          total,
          offset,
          hasNext: offset + limit < total,
        },
      };
    },
    commentIndexDto,
  )
  .use(auth())
  .post(
    '',
    async ({ params, body, user, set }) => {
      const comment = await ProductCommentService.createComment({
        productId: params.id,
        userId: user.id,
        data: body,
      });
      set.status = 201;
      return ProductCommentFormatter.response(comment);
    },
    commentCreateDto,
  );
