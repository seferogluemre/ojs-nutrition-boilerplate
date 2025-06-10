import { auth } from '#modules/auth/authentication/plugin';
import { Elysia } from 'elysia';

import { NotFoundException, dtoWithMiddlewares } from '../../utils';
import { PaginationService } from '../../utils/pagination';
import { AuditLogAction, AuditLogEntity, withAuditLog } from '../audit-logs';
import { PERMISSIONS } from '../auth/roles/constants';
import { withPermission } from '../auth/roles/middleware';
import {
  fileLibraryAssetCreateDto,
  fileLibraryAssetDestroyDto,
  fileLibraryAssetIndexDto,
  fileLibraryAssetShowDto,
  fileLibraryAssetUpdateDto,
} from './dtos';
import { FileLibraryAssetFormatter } from './formatters';
import { FileLibraryAssetsService } from './service';

const app = new Elysia({
  prefix: '/file-library-assets',
  tags: ['FileLibraryAsset'],
})
  .use(auth())
  .get(
    '/',
    async ({ query }) => {
      const { data, total } = await FileLibraryAssetsService.index(query);
      return PaginationService.createPaginatedResponse({
        data,
        total,
        query,
        formatter: FileLibraryAssetFormatter.response,
      });
    },
    fileLibraryAssetIndexDto,
  )
  .get(
    '/:uuid',
    async ({ params }) => {
      const fileLibraryAsset = await FileLibraryAssetsService.show(params.uuid);
      if (!fileLibraryAsset) throw new NotFoundException('Dosya bulunamadı');
      return FileLibraryAssetFormatter.response(fileLibraryAsset);
    },
    fileLibraryAssetShowDto,
  )
  .post(
    '/',
    async ({ body }) => {
      const fileLibraryAsset = await FileLibraryAssetsService.store(body);
      return FileLibraryAssetFormatter.response(fileLibraryAsset);
    },
    dtoWithMiddlewares(
      fileLibraryAssetCreateDto,
      withPermission(PERMISSIONS.FILE_LIBRARY_ASSETS.CREATE),
      withAuditLog({
        actionType: AuditLogAction.CREATE,
        entityType: AuditLogEntity.FILE_LIBRARY_ASSET,
        getEntityUuid: (ctx) => {
          const response = ctx.response as ReturnType<typeof FileLibraryAssetFormatter.response>;
          return response.uuid;
        },
        getDescription: () => {
          return 'Yeni dosya oluşturuldu';
        },
      }),
    ),
  )
  .put(
    '/:uuid',
    async ({ params, body }) => {
      const fileLibraryAsset = await FileLibraryAssetsService.update(params.uuid, body);
      if (!fileLibraryAsset) throw new NotFoundException('Dosya bulunamadı');
      return FileLibraryAssetFormatter.response(fileLibraryAsset);
    },
    dtoWithMiddlewares(
      fileLibraryAssetUpdateDto,
      withPermission(PERMISSIONS.FILE_LIBRARY_ASSETS.UPDATE),
      withAuditLog({
        actionType: AuditLogAction.UPDATE,
        entityType: AuditLogEntity.FILE_LIBRARY_ASSET,
        getEntityUuid: ({ params }) => {
          return params.uuid;
        },
        getDescription: ({ body }) => {
          return `Dosya güncellendi: ${Object.keys(body as object).join(', ')}`;
        },
        getMetadata: ({ body }) => {
          return { updatedFields: body };
        },
      }),
    ),
  )
  .delete(
    '/:uuid',
    async ({ params }) => {
      const fileLibraryAsset = await FileLibraryAssetsService.destroy(params.uuid);
      if (!fileLibraryAsset) throw new NotFoundException('Dosya bulunamadı');
      return { message: 'Dosya başarıyla silindi' };
    },
    dtoWithMiddlewares(
      fileLibraryAssetDestroyDto,
      withPermission(PERMISSIONS.FILE_LIBRARY_ASSETS.DESTROY),
      withAuditLog({
        actionType: AuditLogAction.DELETE,
        entityType: AuditLogEntity.FILE_LIBRARY_ASSET,
        getEntityUuid: ({ params }) => {
          return params.uuid;
        },
        getDescription: () => {
          return 'Dosya silindi';
        },
      }),
    ),
  );

export default app;
