import { dtoWithMiddlewares } from '#utils/middleware-utils.ts';
import Elysia from 'elysia';

import { AuditLogAction, AuditLogEntity, withAuditLog } from '../audit-logs';
import { PERMISSIONS, withPermission } from '../auth';
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
        user_id: user.id.toString(),
      });
      return CartFormatter.format(cart!);
    },
    dtoWithMiddlewares(
      addToCartDto,
      withPermission(PERMISSIONS.CART.CREATE),
      withAuditLog<typeof addToCartDto>({
        actionType: AuditLogAction.CREATE,
        entityType: AuditLogEntity.CART,
        getEntityUuid: ({ body }) => body.product_id,
        getDescription: ({ body }) => `Sepete ${body.quantity} adet ürün eklendi`,
      }),
    ),
  )
  .delete(
    '/:item_uuid',
    async ({ user, set, params }) => {
      const cart = await CartService.delete({
        user_id: user.id,
        item_uuid: params.item_uuid,
      });
      return CartFormatter.format(cart!);
    },
    dtoWithMiddlewares(
      deleteFromCartDto,
      withPermission(PERMISSIONS.CART.DESTROY),
      withAuditLog<typeof deleteFromCartDto>({
        actionType: AuditLogAction.DELETE,
        entityType: AuditLogEntity.CART,
        getEntityUuid: ({ params }) => params.item_uuid,
        getDescription: ({ params }) => `Sepetten ${params.item_uuid} silindi`,
      }),
    ),
  )
  .get(
    '/',
    async ({ user, set }) => {
      const cart = await CartService.get({
        user_id: user.id,
      });
      return CartFormatter.format(cart!);
    },
    dtoWithMiddlewares(
      getCartDto,
      withPermission(PERMISSIONS.CART.INDEX),
      withAuditLog<typeof getCartDto>({
        actionType: AuditLogAction.CREATE,
        entityType: AuditLogEntity.CART,
        getEntityUuid: () => 'Sepet',
        getDescription: () => 'Sepet görüntülendi',
      }),
    ),
  );

export default app;