import Elysia from 'elysia';
import { auth } from '../auth/authentication/plugin';

import { addToCartDto, deleteFromCartDto, getCartDto } from './dtos';
import { CartFormatter } from './formatters';
import { CartService } from './service';

export const app = new Elysia({
  prefix: '/cart-items',
  tags: ['Cart'],
})
  .use(auth())
  .post(
    '/',
    async ({ body, user, set }) => {
      const cart = await CartService.create({
        ...body,
        customer_id: user.id,
      });
      return CartFormatter.format(cart);
    },
    {
      ...addToCartDto,
    },
  )
  .delete(
    '/',
    async ({ body, user, set }) => {
      const cart = await CartService.clear({
        customer_id: user.id,
      });
      set.status = 200;
      return CartFormatter.format(cart);
    },
    {
      ...deleteFromCartDto,
    },
  )
  .get(
    '/',
    async ({ user, set }) => {
      const cart = await CartService.get({
        customer_id: user.id,
      });
      return CartFormatter.format(cart);
    },
    {
      ...getCartDto,
    },
  );

export default app;
