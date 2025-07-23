import { Elysia } from 'elysia';

import { UnauthorizedException } from '../../../utils';
import { verifyCustomerAccessToken } from '../../../utils/jwt';
import { commentCreateDto, commentIndexDto } from './dto';
import { ProductCommentFormatter } from './formatter';
import { ProductCommentService } from './service';

// Customer authentication helper
const authenticateCustomer = (headers: any): string => {
  const authHeader = headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedException('Authorization header required');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyCustomerAccessToken(token);
    return decoded.id;
  } catch (error) {
    throw new UnauthorizedException('Invalid access token');
  }
};

export const app = new Elysia({
  prefix: '/products/:id/comments',
  detail: {
    tags: ['Product Comments'],
  },
})
  .get(
    '',
    async ({ params, query }) => {
      const { data, meta } = await ProductCommentService.getCommentsByProduct({
        productId: params.id,
        limit: query.limit || 10,
        offset: query.offset || 0,
      });

      return {
        data: ProductCommentFormatter.list(data),
        meta,
      };
    },
    commentIndexDto,
  )
  .post(
    '',
    async ({ params, body, headers, set }) => {
      // Customer authentication
      const customerId = authenticateCustomer(headers);
      const comment = await ProductCommentService.createComment({
        productId: params.id,
        customerId,
        data: body,
      });

      set.status = 201;
      return ProductCommentFormatter.response(comment);
    },
    commentCreateDto,
  );
