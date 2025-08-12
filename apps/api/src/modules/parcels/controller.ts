import { Elysia } from 'elysia';

import { NotFoundException, dtoWithMiddlewares } from '../../utils';
import { PaginationService } from '../../utils/pagination';
import { AuditLogAction, AuditLogEntity, withAuditLog } from '../audit-logs';
import { auth } from '../auth/authentication/plugin';
import { PERMISSIONS } from '../auth/roles/constants';
import { withPermission } from '../auth/roles/middleware';
import {
  parcelAssignCourierDto,
  parcelAutoLocationDto,
  parcelCourierAssignedDto,
  parcelDestroyDto,
  parcelGenerateQrDto,
  parcelIndexDto,
  parcelLocationUpdateDto,
  parcelQrCodeDto,
  parcelShowDto,
  parcelStatusUpdateDto,
  parcelTrackDto,
  parcelUpdateDto,
  parcelValidateQrDto
} from './dtos';
import { ParcelFormatter } from './formatters';
import { LocationService } from './location-service';
import { QRService } from './qr-service';
import { ParcelService } from './service';
import { ParcelStatus } from './types';

const app = new Elysia({ prefix: '/parcels', tags: ['Parcel'] })
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
  .get(
    '/:uuid',
    async ({ params }) => {
      const parcel = await ParcelService.show(params.uuid);
      if (!parcel) throw new NotFoundException('Kargo bulunamadı');
      return ParcelFormatter.response(parcel);
    },
    parcelShowDto,
  )
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
    // dtoWithMiddlewares(
    //   parcelCreateDto,
    //   withPermission(PERMISSIONS.PARCELS.CREATE),
    //   withAuditLog({
    //     actionType: AuditLogAction.CREATE,
    //     entityType: AuditLogEntity.PARCEL,
    //     getEntityUuid: (ctx) => {
    //       const response = ctx.response as ReturnType<typeof ParcelFormatter.response>;
    //       return response.uuid;
    //     },
    //     getDescription: () => 'Yeni kargo oluşturuldu',
    //   }),
    // ),
  )
  .put(
    '/:uuid',
    async ({ params, body }) => {
      const parcel = await ParcelService.update(params.uuid, {
        courierId: body.courierId,
        status: body.status as ParcelStatus,
        route: body.route,
        estimatedDelivery: body.estimatedDelivery ? new Date(body.estimatedDelivery) : undefined,
      });
      if (!parcel) throw new NotFoundException('Kargo bulunamadı');
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
        getDescription: ({ body }) =>
          `Kargo güncellendi: ${Object.keys(body as object).join(', ')}`,
        getMetadata: ({ body }) => ({ updatedFields: body }),
      }),
    ),
  )
  .patch(
    '/:id/assign-courier',
    async ({ params, body }) => {
      const parcel = await ParcelService.assignCourier(parseInt(params.id), body.courierId);
      if (!parcel) throw new NotFoundException('Kargo bulunamadı');
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
  .patch(
    '/:id/status',
    async ({ params, body, user }) => {
      const parcel = await ParcelService.updateStatus(
        parseInt(params.id),
        body.status as ParcelStatus,
        body.location,
        body.coordinates,
        body.description,
        user?.id,
      );
      if (!parcel) throw new NotFoundException('Kargo bulunamadı');
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
      if (!user?.id) throw new Error('Kullanıcı bilgisi bulunamadı');
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
  .post(
    '/:id/location',
    async ({ params, body, user }) => {
      if (!user?.id) throw new Error('Kullanıcı bilgisi bulunamadı');
      const location = await ParcelService.updateCourierLocation(
        user.id,
        parseInt(params.id),
        body.coordinates,
        body.address,
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
  .delete(
    '/:uuid',
    async ({ params }) => {
      const deleted = await ParcelService.destroy(params.uuid);
      if (!deleted) throw new NotFoundException('Kargo bulunamadı');
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
  )
  .post(
    '/:id/generate-qr',
    async ({ params, user }) => {
      if (!user?.id) throw new Error('Kullanıcı bilgisi bulunamadı');
      
      const qrData = await QRService.generateQRToken(parseInt(params.id));
      
      return {
        success: true,
        data: qrData,
        message: 'QR kod başarıyla oluşturuldu'
      };
    },
    dtoWithMiddlewares(
      parcelGenerateQrDto,
      withPermission(PERMISSIONS.COURIER.SEND_QR_EMAIL),
      withAuditLog({
        actionType: AuditLogAction.CREATE,
        entityType: AuditLogEntity.PARCEL,
        getEntityUuid: ({ params }) => params.id,
        getDescription: () => 'QR kod oluşturuldu',
      }),
    ),
  )
  .post(
    '/validate-qr',
    async ({ body, user }) => {
      const result = await QRService.validateQRToken(body.token, user?.id);
      
      return result;  
    },
    dtoWithMiddlewares(
      parcelValidateQrDto,
      withAuditLog({
        actionType: AuditLogAction.UPDATE,
        entityType: AuditLogEntity.PARCEL,
        getEntityUuid: ({ body }) => body.token,
        getDescription: () => 'QR kod doğrulandı',
      }),
    ),
  )
  .get(
    '/qr-info/:token',
    async ({ params }) => {
      const qrInfo = await QRService.getQRTokenInfo(params.token);
      
      return {
        success: true,
        data: qrInfo
      };
    },
    parcelQrCodeDto,
  )
  .post(
    '/:id/auto-location',
    async ({ params, body, user }) => {
      if (!user?.id) throw new Error('Kullanıcı bilgisi bulunamadı');
      
      const result = await LocationService.autoDetectAndLogLocation(
        parseInt(params.id),
        body,
        user.id
      );
      return result;
    },
    dtoWithMiddlewares(
      parcelAutoLocationDto,
      withPermission(PERMISSIONS.COURIER.UPDATE_LOCATION),
      withAuditLog({
        actionType: AuditLogAction.UPDATE,
        entityType: AuditLogEntity.PARCEL,
        getEntityUuid: ({ params }) => params.id,
        getDescription: () => 'Otomatik konum tespiti yapıldı',
      }),
    ),
  );

export default app;