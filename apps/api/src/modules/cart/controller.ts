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
      set.status = 201;
      return CartFormatter.format(cart!);
    },
    {
      ...addToCartDto,
    },
  )
  .delete(
    '/:item_uuid',
    async ({ user, set, params }) => {
      const cart = await CartService.delete({
        customer_id: user.id, 
        item_uuid: params.item_uuid,
      });
      set.status = 200;
      return CartFormatter.format(cart!); 
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
      return CartFormatter.format(cart!); 
    },
    {
      ...getCartDto,
    },
  );

export default app;
