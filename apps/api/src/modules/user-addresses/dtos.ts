import { CityPlain } from '#prismabox/City';
import { UserAddressPlain } from '#prismabox/UserAddress';
import { ControllerHook, errorResponseDto } from '#utils';
import { Prisma } from '@prisma/client';
import { t } from 'elysia';

export function getUserAddressFilters(query?: { id?: string; userId?: string }) {
  if (!query) {
    return [false, [], undefined] as const;
  }

  const filters: Prisma.UserAddressWhereInput[] = [];
  const { id, userId } = query;

  if (id) {
    filters.push({ id });
  }

  if (userId) {
    filters.push({ userId });
  }

  return [filters.length > 0, filters, undefined] as const;
}

export const userAddressResponseSchema = t.Object({
  id: UserAddressPlain.properties.id,
  uuid: UserAddressPlain.properties.uuid,
  title: UserAddressPlain.properties.title,
  recipientName: UserAddressPlain.properties.recipientName,
  phone: UserAddressPlain.properties.phone,
  addressLine1: UserAddressPlain.properties.addressLine1,
  addressLine2: UserAddressPlain.properties.addressLine2,
  postalCode: UserAddressPlain.properties.postalCode,
  isDefault: UserAddressPlain.properties.isDefault,
  createdAt: UserAddressPlain.properties.createdAt,
  updatedAt: UserAddressPlain.properties.updatedAt,
  city: t.Object(CityPlain),
  cityId: CityPlain.properties.id,
});

export const userAddressIndexDto = {
  query: t.Optional(
    t.Object({
      userId: t.Optional(t.String()),
    }),
  ),
  response: { 200: t.Array(userAddressResponseSchema) },
  detail: {
    summary: 'Index',
  },
} satisfies ControllerHook;

export const userAddressShowDto = {
  params: t.Object({
    id: UserAddressPlain.properties.id,
  }),
  response: {
    200: userAddressResponseSchema,
    404: errorResponseDto[404],
  },
  detail: {
    summary: 'Show',
  },
} satisfies ControllerHook;

export const userAddressUpdateDto = {
  params: t.Object({
    id: UserAddressPlain.properties.id,
  }),
  body: t.Object({
    title: t.Optional(UserAddressPlain.properties.title),
    recipientName: t.Optional(UserAddressPlain.properties.recipientName),
    phone: t.Optional(UserAddressPlain.properties.phone),
    addressLine1: t.Optional(UserAddressPlain.properties.addressLine1),
    addressLine2: t.Optional(UserAddressPlain.properties.addressLine2),
    postalCode: t.Optional(UserAddressPlain.properties.postalCode),
    isDefault: t.Optional(UserAddressPlain.properties.isDefault),
    cityId: t.Optional(CityPlain.properties.id),
  }),
  response: {
    200: userAddressResponseSchema,
    404: errorResponseDto[404],
    422: errorResponseDto[422],
  },
  detail: {
    summary: 'Update',
  },
} satisfies ControllerHook;

export const userAddressDestroyDto = {
  params: t.Object({
    id: UserAddressPlain.properties.id,
  }),
  response: {
    200: t.Object({
      message: t.String(),
    }),
    404: errorResponseDto[404],
  },
  detail: {
    summary: 'Destroy',
  },
} satisfies ControllerHook;

export const userAddressCreateDto = {
  body: t.Object({
    title: UserAddressPlain.properties.title,
    recipientName: UserAddressPlain.properties.recipientName,
    phone: UserAddressPlain.properties.phone,
    addressLine1: UserAddressPlain.properties.addressLine1,
    addressLine2: UserAddressPlain.properties.addressLine2,
    postalCode: UserAddressPlain.properties.postalCode,
    isDefault: UserAddressPlain.properties.isDefault,
    cityId: CityPlain.properties.id,
  }),
  response: {
    200: userAddressResponseSchema,
    409: errorResponseDto[409],
    422: errorResponseDto[422],
  },
  detail: {
    summary: 'Create',
  },
} satisfies ControllerHook;

export const userAddressCreateResponseDto = userAddressCreateDto.response['200'];
