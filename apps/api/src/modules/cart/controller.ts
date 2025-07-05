import Elysia from 'elysia';

import { addToCartDto, deleteFromCartDto, getCartDto } from './dtos';
import { CartFormatter } from './formatters';
import { CartService } from './service';

export const app = new Elysia({
  prefix: '/cart',
  tags: ['Cart'],
})
  // .use(customerAuth)
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
      const cart = await CartService.delete({
        ...body,
        customer_id: user.id,
      });
      return CartFormatter.format(cart);
    },
    {
      ...deleteFromCartDto,
    },
  )
  .get('/', async ({ user, set }) => {
    const cart = await CartService.get({
      customer_id: user.id,
    });
    return CartFormatter.format(cart);
  },
  {
    ...getCartDto,
  },
);
