import { AuditLogAction, AuditLogEntity } from '#modules/audit-logs/constants.ts';
import { withAuditLog } from '#modules/audit-logs/middleware.ts';
import { auth } from '#modules/auth/authentication/plugin.ts';
import { PERMISSIONS, withPermission } from '#modules/auth/index.ts';
import { dtoWithMiddlewares } from '#utils/middleware-utils.ts';
import Elysia from 'elysia';

import {
  createVariantDto,
  deleteVariantDto,
  getProductVariantsDto,
  updateVariantDto,
} from './dtos';
import { ProductVariantFormatter } from './formatters';
import { ProductVariantService } from './service';

export const app = new Elysia({
  prefix: '/variants',
  tags: ['Product Variants'],
})
  .get(
    '/products/:id/variants',
    async ({ params }) => {
      const variants = await ProductVariantService.get({ product_id: params.id });
      return ProductVariantFormatter.formatList(variants);
    },
    getProductVariantsDto,
  )
  .use(auth())
  .post(
    '/products/:id/variants',
    async ({ params, body, set }) => {
      const variant = await ProductVariantService.create({
        product_id: params.id,
        name: body.name,
        aroma: body.aroma,
        price: body.price,
      });
      set.status = 201;
      return ProductVariantFormatter.format(variant);
    },
    dtoWithMiddlewares(
      createVariantDto,
      withPermission(PERMISSIONS.PRODUCTS_VARIANTS.CREATE),
      withAuditLog<typeof createVariantDto>({
        actionType: AuditLogAction.CREATE,
        entityType: AuditLogEntity.PRODUCT,
        getEntityUuid: ({ params }) => params.id,
        getDescription: () => 'Ürün varyantı oluşturuldu',
      }),
    ),
  )
  .put(
    '/:id',
    async ({ params, body }) => {
      const variant = await ProductVariantService.update({
        variant_id: params.id,
        name: body.name,
      });
      return ProductVariantFormatter.format(variant);
    },
    dtoWithMiddlewares(
      updateVariantDto,
      withPermission(PERMISSIONS.PRODUCTS_VARIANTS.UPDATE),
      withAuditLog<typeof updateVariantDto>({
        actionType: AuditLogAction.CREATE,
        entityType: AuditLogEntity.PRODUCT,
        getEntityUuid: ({ params }) => params.id,
        getDescription: () => 'Ürün varyantı güncellendi',
      }),
    ),
  )
  .delete(
    '/:id',
    async ({ params, query }) => {
      const result = await ProductVariantService.delete({
        variant_id: params.id,
        product_id: query.product_id,
      });
      return result;
    },
    dtoWithMiddlewares(
      deleteVariantDto,
      withPermission(PERMISSIONS.PRODUCTS_VARIANTS.DESTROY),
      withAuditLog<typeof deleteVariantDto>({
        actionType: AuditLogAction.DELETE,
        entityType: AuditLogEntity.PRODUCT,
        getEntityUuid: ({ params }) => params.id,
        getDescription: () => 'Ürün varyantı silindi',
      }),
    ),
  );
