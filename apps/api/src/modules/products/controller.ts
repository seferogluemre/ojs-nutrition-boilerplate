import { Elysia } from 'elysia';

import { dtoWithMiddlewares } from '../../utils';
import { FileUploadUtil } from '../../utils/file-upload';
import { AuditLogAction, AuditLogEntity, withAuditLog } from '../audit-logs';
import { auth, authSwagger } from '../auth/authentication/plugin';
import { PERMISSIONS } from '../auth/roles/constants';
import { withPermission } from '../auth/roles/middleware';
import {
  bestSellersDto,
  productCreateDto,
  productDestroyDto,
  productIndexDto,
  productShowDto,
  productUpdateDto,
} from './dtos';
import { ProductFormatter } from './formatter';
import { ProductsService } from './service';

const app = new Elysia({
  prefix: '/products',
  detail: {
    tags: ['Product'],
  },
})
  .get(
    '/best-sellers',
    async ({ query }) => {
      const products = await ProductsService.getBestSellers(query);
      return products.map(ProductFormatter.bestSeller);
    },
    bestSellersDto,
  )
  .get(
    '', // GET /products - Tüm ürünleri listele
    async ({ query }) => {
      const { data: products, meta } = await ProductsService.index(query);
      return {
        data: products.map(ProductFormatter.response),
        meta,
      };
    },
    productIndexDto,
  )
  .get(
    '/:id', // GET /products/:id - Tek ürün getir
    async ({ params }) => {
      const product = await ProductsService.show(params.id);
      return ProductFormatter.response(product);
    },
    productShowDto,
  )
  .guard(authSwagger, (app) =>
    app
      .use(auth())
      .post(
        '', 
        async ({ body }) => {
          // File upload handle
          const { fileUrl } = await FileUploadUtil.uploadProductPhoto(body.primaryPhotoUrl);
          
          const productData = {
            ...body,
            primaryPhotoUrl: fileUrl,
          };
          
          const product = await ProductsService.store(productData);
          return ProductFormatter.response(product);
        },
        dtoWithMiddlewares(
          productCreateDto,
          withPermission(PERMISSIONS.PRODUCTS.CREATE),
          withAuditLog<typeof productCreateDto>({
            actionType: AuditLogAction.CREATE,
            entityType: AuditLogEntity.PRODUCT,
            getEntityUuid: (ctx) => {
              const response = ctx.response as ReturnType<typeof ProductFormatter.response>;
              return response.id;
            },
            getDescription: ({ body }) => `Yeni ürün oluşturuldu: ${body.name}`,
          }),
        ),
      )
      .patch(
        '/:id', 
        async ({ params, body }) => {
          const product = await ProductsService.update(params.id, body);
          return ProductFormatter.response(product);
        },
        dtoWithMiddlewares(
          productUpdateDto,
          withPermission(PERMISSIONS.PRODUCTS.UPDATE),
          withAuditLog<typeof productUpdateDto>({
            actionType: AuditLogAction.UPDATE,
            entityType: AuditLogEntity.PRODUCT,
            getEntityUuid: ({ params }) => params.id,
            getDescription: ({ params, body }) =>
              `Ürün güncellendi: ${params.id}${body.name ? ` - ${body.name}` : ''}`,
          }),
        ),
      )

      .delete(
        '/:id', // DELETE /products/:id - Ürün sil
        async ({ params }) => {
          await ProductsService.destroy(params.id);
          return { message: 'Ürün başarıyla silindi' };
        },
        dtoWithMiddlewares(
          productDestroyDto,
          withPermission(PERMISSIONS.PRODUCTS.DESTROY),
          withAuditLog<typeof productDestroyDto>({
            actionType: AuditLogAction.DELETE,
            entityType: AuditLogEntity.PRODUCT,
            getEntityUuid: ({ params }) => params.id,
            getDescription: ({ params }) => `Ürün silindi: ${params.id}`,
          }),
        ),
      ),
  );

export default app;
