import { Elysia } from 'elysia';
import { dtoWithMiddlewares } from '../../utils';
import { PaginationService } from '../../utils/pagination';
import { AuditLogAction, AuditLogEntity, withAuditLog } from '../audit-logs';
import { auth } from '../auth/authentication/plugin';
import { PERMISSIONS } from '../auth/roles/constants';
import { withPermission } from '../auth/roles/middleware';
import {
    parcelAssignCourierDto,
    parcelCourierAssignedDto,
    parcelCreateDto,
    parcelDestroyDto,
    parcelIndexDto,
    parcelLocationUpdateDto,
    parcelShowDto,
    parcelStatusUpdateDto,
    parcelTrackDto,
    parcelUpdateDto,
} from './dtos';
import { ParcelFormatter } from './formatters';
import { ParcelService } from './service';
import { ParcelStatus } from './types';

const app = new Elysia({ prefix: '/parcels', tags: ['Parcel'] })
  // Kargo listesi (Admin/Courier)
  .get(
    '/',
    async ({ query }) => {
      const { data, total } = await ParcelService.index(query);
      return PaginationService.createPaginatedResponse({
        data,
        total,
        query,
        formatter: ParcelFormatter.listResponse,
      });
    },
    parcelIndexDto,
  )

  // Kargo detayı
  .get(
    '/:uuid',
    async ({ params }) => {
      const parcel = await ParcelService.show(params.uuid);
      return ParcelFormatter.response(parcel);
    },
    parcelShowDto,
  )

  // Kargo takip et (Public - tracking number ile)
  .get(
    '/track/:trackingNumber',
    async ({ params }) => {
      const trackingInfo = await ParcelService.getTrackingInfo(params.trackingNumber);
      
      return {
        success: true,
        data: ParcelFormatter.trackingResponse(trackingInfo),
      };
    },
    parcelTrackDto,
  )

  .use(auth())

  // Kargo oluştur (Admin)
  .post(
    '/',
    async ({ body }) => {
      const parcel = await ParcelService.create({
        orderId: body.orderId,
        courierId: body.courierId,
        route: body.route,
        estimatedDelivery: body.estimatedDelivery ? new Date(body.estimatedDelivery) : undefined,
      });

      return ParcelFormatter.response(parcel);
    },
    dtoWithMiddlewares(
      parcelCreateDto,
      withPermission(PERMISSIONS.PARCELS.CREATE),
      withAuditLog({
        actionType: AuditLogAction.CREATE,
        entityType: AuditLogEntity.PARCEL,
        getEntityUuid: (ctx) => {
          const response = ctx.response as any;
          return response.uuid;
        },
        getDescription: () => 'Yeni kargo oluşturuldu',
      }),
    ),
  )

  // Kargo güncelle (Admin)
  .put(
    '/:uuid',
    async ({ params, body }) => {
      const parcel = await ParcelService.update(params.uuid, {
        courierId: body.courierId,
        status: body.status as ParcelStatus,
        route: body.route,
        estimatedDelivery: body.estimatedDelivery ? new Date(body.estimatedDelivery) : undefined,
      });

      return {
        ...ParcelFormatter.response(parcel),
        message: 'Kargo başarıyla güncellendi',
      };
    },
    dtoWithMiddlewares(
      parcelUpdateDto,
      withPermission(PERMISSIONS.PARCELS.UPDATE),
      withAuditLog({
        actionType: AuditLogAction.UPDATE,
        entityType: AuditLogEntity.PARCEL,
        getEntityUuid: ({ params }) => params.uuid,
        getDescription: ({ body }) => `Kargo güncellendi: ${Object.keys(body as object).join(', ')}`,
        getMetadata: ({ body }) => ({ updatedFields: body }),
      }),
    ),
  )

  // Kuryeye ata (Admin)
  .patch(
    '/:id/assign-courier',
    async ({ params, body }) => {
      const parcel = await ParcelService.assignCourier(
        parseInt(params.id),
        body.courierId
      );

      return {
        ...ParcelFormatter.response(parcel),
        message: 'Kurye başarıyla atandı',
      };
    },
    dtoWithMiddlewares(
      parcelAssignCourierDto,
      withPermission(PERMISSIONS.PARCELS.ASSIGN_COURIER),
      withAuditLog({
        actionType: AuditLogAction.UPDATE,
        entityType: AuditLogEntity.PARCEL,
        getEntityUuid: ({ params }) => params.id,
        getDescription: ({ body }) => `Kurye atandı: ${body.courierId}`,
      }),
    ),
  )

  // Status güncelle (Courier/Admin)
  .patch(
    '/:id/status',
    async ({ params, body, user }) => {
      const parcel = await ParcelService.updateStatus(
        parseInt(params.id),
        body.status as ParcelStatus,
        body.location,
        body.coordinates,
        body.description,
        user?.id
      );

      return {
        uuid: parcel.uuid,
        status: parcel.status,
        message: 'Kargo durumu güncellendi',
      };
    },
    dtoWithMiddlewares(
      parcelStatusUpdateDto,
      withPermission(PERMISSIONS.PARCELS.UPDATE_STATUS),
      withAuditLog({
        actionType: AuditLogAction.UPDATE,
        entityType: AuditLogEntity.PARCEL,
        getEntityUuid: ({ params }) => params.id,
        getDescription: ({ body }) => `Kargo durumu güncellendi: ${body.status}`,
      }),
    ),
  )

  .get(
    '/courier/assigned',
    async ({ user, query }) => {
      if (!user?.id) {
        throw new Error('Kullanıcı bilgisi bulunamadı');
      }

      const { data, total } = await ParcelService.getCourierAssignedParcels(user.id, query);
      
      return PaginationService.createPaginatedResponse({
        data,
        total,
        query,
        formatter: ParcelFormatter.courierAssignedResponse,
      });
    },
    dtoWithMiddlewares(
      parcelCourierAssignedDto,
      withPermission(PERMISSIONS.COURIER.VIEW_ASSIGNED_PARCELS),
    ),
  )

  // Kurye konumunu güncelle (Courier)
  .post(
    '/:id/location',
    async ({ params, body, user }) => {
      if (!user?.id) {
        throw new Error('Kullanıcı bilgisi bulunamadı');
      }

      const location = await ParcelService.updateCourierLocation(
        user.id,
        parseInt(params.id),
        body.coordinates,
        body.address
      );

      return {
        success: true,
        data: ParcelFormatter.locationResponse(location),
        message: 'Konum güncellendi',
      };
    },
    dtoWithMiddlewares(
      parcelLocationUpdateDto,
      withPermission(PERMISSIONS.COURIER.UPDATE_LOCATION),
      withAuditLog({
        actionType: AuditLogAction.UPDATE,
        entityType: AuditLogEntity.PARCEL,
        getEntityUuid: ({ params }) => params.id,
        getDescription: () => 'Kurye konumu güncellendi',
      }),
    ),
  )

  // Kargo sil (Admin)
  .delete(
    '/:uuid',
    async ({ params }) => {
      await ParcelService.destroy(params.uuid);
      return { message: 'Kargo başarıyla silindi' };
    },
    dtoWithMiddlewares(
      parcelDestroyDto,
      withPermission(PERMISSIONS.PARCELS.DESTROY),
      withAuditLog({
        actionType: AuditLogAction.DELETE,
        entityType: AuditLogEntity.PARCEL,
        getEntityUuid: ({ params }) => params.uuid,
        getDescription: () => 'Kargo silindi',
      }),
    ),
  );

export default app;
