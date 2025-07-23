import { ProductCommentsPlain } from '#prismabox/ProductComments';
import { t } from 'elysia';

import { headers } from '../../../utils';
import { errorResponseDto } from '../../../utils/common-dtos';
import { type ControllerHook } from '../../../utils/elysia-types';

// Response schemas
export const commentResponseSchema = t.Object({
  id: ProductCommentsPlain.properties.uuid,
  title: t.Union([t.String(), t.Null()]),
  content: t.Union([t.String(), t.Null()]),
  rating: ProductCommentsPlain.properties.rating,
  customer: t.Object({
    id: t.String(),
    name: t.String(),
  }),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const commentListResponseSchema = t.Object({
  data: t.Array(commentResponseSchema),
  meta: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    hasNext: t.Boolean(),
  }),
});

// Query parameters schema for index
export const commentIndexQuerySchema = t.Object({
  limit: t.Optional(
    t.Number({
      minimum: 1,
      maximum: 100,
      error: 'Limit 1-100 arasında olmalıdır.',
    }),
  ),
  offset: t.Optional(
    t.Number({
      minimum: 0,
      error: 'Offset sıfır veya pozitif bir sayı olmalıdır.',
    }),
  ),
});

// Create comment schema
export const commentCreateSchema = t.Object({
  title: t.Optional(
    t.String({
      maxLength: 50,
      error: 'Başlık en fazla 50 karakter olmalıdır.',
    }),
  ),
  content: t.Optional(
    t.String({
      maxLength: 250,
      error: 'İçerik en fazla 250 karakter olmalıdır.',
    }),
  ),
  rating: t.Number({
    minimum: 1,
    maximum: 5,
    error: 'Değerlendirme 1-5 arasında olmalıdır.',
  }),
});

// DTO definitions
export const commentIndexDto = {
  params: t.Object({
    id: t.String({
      format: 'uuid',
      error: 'Ürün ID geçerli bir UUID olmalıdır.',
    }),
  }),
  query: commentIndexQuerySchema,
  response: {
    200: commentListResponseSchema,
    404: errorResponseDto[404],
  },
  detail: {
    summary: 'Get product comments',
    description: 'Retrieves comments for a specific product with pagination.',
  },
} satisfies ControllerHook;

export const commentCreateDto = {
  headers: headers,
  params: t.Object({
    id: t.String({
      format: 'uuid',
      error: 'Ürün ID geçerli bir UUID olmalıdır.',
    }),
  }),
  body: commentCreateSchema,
  response: {
    201: commentResponseSchema,
    400: errorResponseDto[400],
    401: errorResponseDto[401],
    404: errorResponseDto[404],
    422: errorResponseDto[422],
  },
  detail: {
    summary: 'Create a product comment',
    description: 'Creates a new comment for a specific product.',
  },
} satisfies ControllerHook;
