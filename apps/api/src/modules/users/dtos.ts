import { UserInputUpdate, UserPlain } from '#prismabox/User';
import { __nullable__, Gender } from '#prismabox/barrel';
import { t } from 'elysia';

import { Prisma } from '@prisma/client';
import { ControllerHook, errorResponseDto } from '../../utils';
import { passwordValidation } from './field-validations';

const recordStatusEnum = t.Union([t.Literal('ACTIVE'), t.Literal('DELETED'), t.Literal('ALL')]);

const statusEnum = t.Union([t.Literal('ACTIVE'), t.Literal('INACTIVE'), t.Literal('ALL')]);

export function getUserFilters(query?: { id?: string; username?: string; email?: string }) {
  if (!query) {
    return [false, [], undefined] as const;
  }

  const filters: Prisma.UserWhereInput[] = [];
  const { id, email } = query;

  if (id) {
    filters.push({ id });
  }

  if (email) {
    filters.push({ email });
  }

  return [filters.length > 0, filters, undefined] as const;
}

export const userResponseSchema = t.Object({
  id: UserPlain.properties.id,
  email: UserPlain.properties.email,
  firstName: UserPlain.properties.firstName,
  lastName: UserPlain.properties.lastName,
  rolesSlugs: UserPlain.properties.rolesSlugs,
  isActive: UserPlain.properties.isActive,
  createdAt: UserPlain.properties.createdAt,
  updatedAt: UserPlain.properties.updatedAt,
  image: UserPlain.properties.image,
});

export const userIndexDto = {
  query: t.Object({
    id: t.Optional(UserPlain.properties.id),
    email: t.Optional(UserPlain.properties.email),
    recordStatus: t.Optional(recordStatusEnum),
    status: t.Optional(statusEnum),
  }),
  response: { 200: t.Array(userResponseSchema) },
  detail: {
    summary: 'Index',
  },
} satisfies ControllerHook;

export const userShowDto = {
  params: t.Object({
    id: UserPlain.properties.id,
  }),
  query: t.Object({
    recordStatus: t.Optional(recordStatusEnum),
    status: t.Optional(statusEnum),
  }),
  response: {
    200: userResponseSchema,
    404: errorResponseDto[404],
  },
  detail: {
    summary: 'Show',
  },
} satisfies ControllerHook;

export const userUpdateDto = {
  params: t.Object({
    id: UserPlain.properties.id,
  }),
  body: t.Object({
    password: t.Optional(passwordValidation),
    email: t.Optional(UserInputUpdate.properties.email),
    firstName: t.Optional(UserInputUpdate.properties.firstName),
    lastName: t.Optional(UserInputUpdate.properties.lastName),
    isActive: t.Optional(t.Boolean()),
    gender: t.Optional(t.Enum(Gender)),
    imageFile: t.Optional(__nullable__(t.File())),
    emailVerified: t.Optional(t.Boolean()),
  }),
  response: {
    200: userResponseSchema,
    404: errorResponseDto[404],
    422: errorResponseDto[422],
  },
  detail: {
    summary: 'Update',
  },
} satisfies ControllerHook;

export const userDestroyDto = {
  params: t.Object({
    id: UserPlain.properties.id,
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

export const userSignupDto = {
  body: t.Object({
    email: t.String(),
    password: t.String(),
    firstName: t.String(),
    lastName: t.String(),
  }),
  response: {
    200: userResponseSchema,
    422: errorResponseDto[422],
  },
  detail: {
    summary: 'User Signup',
    description: 'Yeni kullanıcı kaydı',
  },
} satisfies ControllerHook;

export const userCreateDto = {
  body: t.Object({
    email: t.String({ minLength: 3, maxLength: 255 }),
    password: t.String({ minLength: 8, maxLength: 32 }),
    firstName: t.String({ minLength: 2, maxLength: 50 }),
    lastName: t.String({ minLength: 2, maxLength: 50 }),
    rolesSlugs: t.Array(t.String()),
    isActive: t.Optional(t.Boolean()),
    gender: t.Enum(Gender),
    imageFile: t.Optional(__nullable__(t.File())),
  }),
  response: {
    200: userResponseSchema,
    409: errorResponseDto[409],
    422: errorResponseDto[422],
  },
  detail: {
    summary: 'Create',
  },
} satisfies ControllerHook;
export const userCreateResponseDto = userCreateDto.response['200'];

export const userUpdateMeDto = {
  body: t.Object({
    firstName: t.Optional(t.String({ minLength: 2, maxLength: 50 })),
    lastName: t.Optional(t.String({ minLength: 2, maxLength: 50 })),
    phone: t.Optional(t.String({ minLength: 10, maxLength: 15 })),
    gender: t.Optional(t.Enum(Gender)),
  }),
  response: {
    200: userResponseSchema,
    422: errorResponseDto[422],
  },
  detail: {
    summary: 'Update Own Profile',
  },
} satisfies ControllerHook;
