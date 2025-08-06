import { dtoWithMiddlewares } from '#utils/middleware-utils.ts';
import Elysia from 'elysia';

import { AuditLogAction, AuditLogEntity, withAuditLog } from '../audit-logs';
import { PERMISSIONS, withPermission } from '../auth';
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
    dtoWithMiddlewares(
      getOrdersDto,
      withPermission(PERMISSIONS.ORDERS.INDEX),
      withAuditLog<typeof getOrdersDto>({
        actionType: AuditLogAction.CREATE,
        entityType: AuditLogEntity.ORDER,
        getEntityUuid: () => 'Sipariş',
        getDescription: ({ user }) => `Siparişler görüntülendi: ${user.id}`,
      }),
    ),
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
    dtoWithMiddlewares(
      getOrderDetailDto,
      withPermission(PERMISSIONS.ORDERS.SHOW),
      withAuditLog<typeof getOrderDetailDto>({
        actionType: AuditLogAction.CREATE,
        entityType: AuditLogEntity.ORDER,
        getEntityUuid: ({ params }) => params.id,
        getDescription: () => 'Sipariş detayı görüntülendi',
      }),
    ),
  )
  .post(
    '/complete-shopping',
    async ({ body, user, set }) => {
      const order = await OrderService.completeOrder({
        ...body,
        user_id: user.id,
      });
      return OrderFormatter.format(order);
    },
    dtoWithMiddlewares(
      completeShoppingDto,
      withPermission(PERMISSIONS.ORDERS.CREATE),
      withAuditLog<typeof completeShoppingDto>({
        actionType: AuditLogAction.CREATE,
        entityType: AuditLogEntity.ORDER,
        getEntityUuid: () => 'Sipariş',
        getDescription: ({ body }) => `Sipariş oluşturuldu: ${body.order_id}`,
      }),
    ),
  );

export default app;
