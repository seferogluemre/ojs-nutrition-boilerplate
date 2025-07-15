import { CityPlain } from '#prismabox/City';
import { CustomerAddressPlain } from '#prismabox/CustomerAddress';
import { ControllerHook, errorResponseDto } from '#utils';

import { t } from 'elysia';

export function getCustomerAddressFilters(query?: { id?: string; customerId?: number }) {
  if (!query) {
    return [false, [], undefined] as const;
  }

  const filters: any[] = []; 
  const { id, customerId } = query;

  if (id) {
    filters.push({ id: parseInt(id) });
  }

  if (customerId) {
    filters.push({ customerId });
  }

  return [filters.length > 0, filters, undefined] as const;
}

export const customerAddressResponseSchema = t.Object({
  uuid: CustomerAddressPlain.properties.uuid,
  title: CustomerAddressPlain.properties.title,
  recipientName: CustomerAddressPlain.properties.recipientName,
  phone: CustomerAddressPlain.properties.phone,
  addressLine1: CustomerAddressPlain.properties.addressLine1,
  addressLine2: CustomerAddressPlain.properties.addressLine2,
  postalCode: CustomerAddressPlain.properties.postalCode,
  isDefault: CustomerAddressPlain.properties.isDefault,
  createdAt: CustomerAddressPlain.properties.createdAt,
  updatedAt: CustomerAddressPlain.properties.updatedAt,
  city: t.Object(CityPlain),
  cityId: CityPlain.properties.id,
});

export const customerAddressIndexDto = {
  query: t.Optional(
    t.Object({
      customerId: t.Optional(t.Number()),
    }),
  ),
  response: { 200: t.Array(customerAddressResponseSchema) },
  detail: {
    summary: 'Get Customer Addresses',
    description: 'Retrieves all addresses for the authenticated customer',
  },
} satisfies ControllerHook;

export const customerAddressShowDto = {
  params: t.Object({
    id: t.Number({
      minimum: 1,
      error: 'Address ID geçerli bir sayı olmalıdır.',
    }),
  }),
  response: {
    200: customerAddressResponseSchema,
    404: errorResponseDto[404],
  },
  detail: {
    summary: 'Get Customer Address',
    description: 'Retrieves a single customer address by ID',
  },
} satisfies ControllerHook;

export const customerAddressCreateDto = {
  body: t.Object({
    title: CustomerAddressPlain.properties.title,
    recipientName: CustomerAddressPlain.properties.recipientName,
    phone: CustomerAddressPlain.properties.phone,
    addressLine1: CustomerAddressPlain.properties.addressLine1,
    addressLine2: t.Optional(CustomerAddressPlain.properties.addressLine2),
    postalCode: CustomerAddressPlain.properties.postalCode,
    isDefault: CustomerAddressPlain.properties.isDefault,
    cityId: CityPlain.properties.id,
  }),
  response: {
    201: customerAddressResponseSchema,
    400: errorResponseDto[400],
    422: errorResponseDto[422],
  },
  detail: {
    summary: 'Create Customer Address',
    description: 'Creates a new address for the authenticated customer',
  },
} satisfies ControllerHook;

export const customerAddressUpdateDto = {
  params: t.Object({
    id: t.Number({
      minimum: 1,
      error: 'Address ID geçerli bir sayı olmalıdır.',
    }),
  }),
  body: t.Object({
    title: t.Optional(CustomerAddressPlain.properties.title),
    recipientName: t.Optional(CustomerAddressPlain.properties.recipientName),
    phone: t.Optional(CustomerAddressPlain.properties.phone),
    addressLine1: t.Optional(CustomerAddressPlain.properties.addressLine1),
    addressLine2: t.Optional(CustomerAddressPlain.properties.addressLine2),
    postalCode: t.Optional(CustomerAddressPlain.properties.postalCode),
    isDefault: t.Optional(CustomerAddressPlain.properties.isDefault),
    cityId: t.Optional(CityPlain.properties.id),
  }),
  response: {
    200: customerAddressResponseSchema,
    404: errorResponseDto[404],
    422: errorResponseDto[422],
  },
  detail: {
    summary: 'Update Customer Address',
    description: 'Updates an existing customer address',
  },
} satisfies ControllerHook;

export const customerAddressDestroyDto = {
  params: t.Object({
    id: t.Number({
      minimum: 1,
      error: 'Address ID geçerli bir sayı olmalıdır.',
    }),
  }),
  response: {
    200: t.Object({
      message: t.String(),
    }),
    404: errorResponseDto[404],
  },
  detail: {
    summary: 'Delete Customer Address',
    description: 'Deletes a customer address by ID',
  },
} satisfies ControllerHook; 