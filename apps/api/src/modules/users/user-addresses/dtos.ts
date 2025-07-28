import { CityPlain } from '#prismabox/City';
import { UserAddressPlain } from '#prismabox/UserAddress';
import { ControllerHook, errorResponseDto } from '#utils';
import { t } from 'elysia';

export const userAddressResponseSchema = t.Composite([
  t.Omit(UserAddressPlain, [ 'postalCode']),
  t.Object({
    city: t.Pick(CityPlain, ['id','stateName','name']),
  }),
]);

export const userAddressIndexDto = {
  response: { 200: t.Array(userAddressResponseSchema) },
  detail: {
    summary: 'Index',
  },
} satisfies ControllerHook;

export const userAddressShowDto = {
  params: t.Object({
    id: t.String(),
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
    id: t.String(),
  }),
  body: t.Partial(
    t.Pick(UserAddressPlain, [
      'title',
      'recipientName',
      'phone',
      'addressLine1',
      'addressLine2',
      'postalCode',
      'isDefault',
      'cityId',
    ])
  ),
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
    id: t.String(),
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
    cityId: t.Integer({ minimum: 1 }),
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
