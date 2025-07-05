import { Static } from 'elysia';

import { addToCartDto } from './dtos';

export type AddToCartDto = Static<typeof addToCartDto>;

export type AddToCartParams = AddToCartDto & {
  customer_id: number;
};

export type GetCartParams = {
  customer_id: string;
};

export type RemoveFromCartParams = {
  customer_id: number;
  item_uuid: string;
};
