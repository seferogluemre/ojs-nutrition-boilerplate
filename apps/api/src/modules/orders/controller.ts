import Elysia from 'elysia';

import { auth } from '../auth/authentication/plugin';
import { completeShoppingDto, getOrderDetailDto, getOrdersDto } from './dtos';
import { OrderFormatter } from './formatters';
import { OrderService } from './service';

export const app = new Elysia({
  prefix: '/orders',
  tags: ['Orders'],
})
  .use(auth())
  .get(
    '/',
    async ({ user }) => {
      const orders = await OrderService.getUserOrders({
        user_id: user.id,
      });
      return OrderFormatter.formatList(orders);
    },
    getOrdersDto,
  )
  .get(
    '/:id',
    async ({ user, params }) => {
      const order = await OrderService.getOrderDetail({
        user_id: user.id,
        order_id: params.id,
      });
      return OrderFormatter.format(order);
    },
    getOrderDetailDto,
  )
  .post(
    '/complete-shopping',
    async ({ body, user, set }) => {
      const order = await OrderService.completeOrder({
        ...body,
        user_id: user.id,
      });
      set.status = 201;
      return OrderFormatter.format(order);
    },
    completeShoppingDto,
  );

export default app;