/* eslint-disable @typescript-eslint/no-unused-vars */
import { Elysia } from 'elysia';

import { dtoWithMiddlewares } from '../../utils';
import { AuditLogAction, AuditLogEntity, withAuditLog } from '../audit-logs';
import {
  customerAddressCreateDto,
  customerAddressDestroyDto,
  customerAddressIndexDto,
  customerAddressShowDto,
  customerAddressUpdateDto
} from './dtos';
import { CustomerAddressFormatter } from './formatters';
import { CustomerAddressesService } from './service';

export const app = new Elysia({
  prefix: '/customer-addresses',
  detail: {
    tags: ['CustomerAddress'],
  },
})
  // 🚨 GEÇİCİ: TEST İÇİN AÇIK - CUSTOMER AUTH EKLENECEk
  .derive(({ headers }) => {
    // Mock customer user (test için)
    const user = {
      id: 1, // Test customer ID
      role: 'customer'
    };
    return { user };
  })
  .post(
    '', // create customer address
    async ({ body, user }) => {
      const customerAddress = await CustomerAddressesService.store({
        ...body,
        customerId: user.id, // Customer ID'yi otomatik ekle
      });
      return CustomerAddressFormatter.response(customerAddress);
    },
    dtoWithMiddlewares(
      customerAddressCreateDto,
      withAuditLog<typeof customerAddressCreateDto>({
        actionType: AuditLogAction.CREATE,
        entityType: AuditLogEntity.USER, // TODO: CUSTOMER entity eklenebilir
        getEntityUuid: (ctx) => {
          const response = ctx.response as ReturnType<typeof CustomerAddressFormatter.response>;
          return response.uuid;
        },
        getDescription: () => 'Yeni müşteri adresi oluşturuldu',
      }),
    ),
  )
  .get(
    '', // index - customer'ın tüm adresleri
    async ({ query, user }) => {
      const queryWithCustomer = {
        ...query,
        customerId: user.id, // Customer sadece kendi adreslerini görebilir
      };
      const customerAddresses = await CustomerAddressesService.index(queryWithCustomer);
      const response = customerAddresses.map(CustomerAddressFormatter.response);
      return response;
    },
    customerAddressIndexDto,
  )
  .get(
    '/:id', // show - tek adres
    async ({ params: { id }, user }) => {
      const customerAddress = await CustomerAddressesService.show({ 
        id: parseInt(id.toString()),
        customerId: user.id, // Customer sadece kendi adresini görebilir
      });
      const response = CustomerAddressFormatter.response(customerAddress);
      return response;
    },
    customerAddressShowDto,
  )
  .patch(
    '/:id', // update
    async ({ params: { id }, body, user }) => {
      // Önce adresin customer'a ait olduğunu kontrol et
      await CustomerAddressesService.show({ 
        id: parseInt(id.toString()),
        customerId: user.id,
      });
      
      const updatedCustomerAddress = await CustomerAddressesService.update(id.toString(), body);
      const response = CustomerAddressFormatter.response(updatedCustomerAddress);
      return response;
    },
    dtoWithMiddlewares(
      customerAddressUpdateDto,
      withAuditLog<typeof customerAddressUpdateDto>({
        actionType: AuditLogAction.UPDATE,
        entityType: AuditLogEntity.USER, // TODO: CUSTOMER entity
        getEntityUuid: ({ params }) => params.id.toString(),
        getDescription: () => 'Müşteri adresi güncellendi',
      }),
    ),
  )
  .delete(
    '/:id', // destroy
    async ({ params: { id }, user }) => {
      // Önce adresin customer'a ait olduğunu kontrol et
      await CustomerAddressesService.show({ 
        id: parseInt(id.toString()),
        customerId: user.id,
      });
      
      await CustomerAddressesService.destroy(id.toString());
      return { message: 'Müşteri adresi silindi' };
    },
    dtoWithMiddlewares(
      customerAddressDestroyDto,
      withAuditLog<typeof customerAddressDestroyDto>({
        actionType: AuditLogAction.DELETE,
        entityType: AuditLogEntity.USER, // TODO: CUSTOMER entity
        getEntityUuid: ({ params }) => params.id.toString(),
        getDescription: () => 'Müşteri adresi silindi',
      }),
    ),
  );

export default app; 