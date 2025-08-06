import { ProductCommentsPlain } from '#prismabox/ProductComments';
import { t } from 'elysia';

import { headers } from '../../../utils';
import { errorResponseDto } from '../../../utils/common-dtos';
import { type ControllerHook } from '../../../utils/elysia-types';

export const commentResponseSchema = t.Object({
  id: ProductCommentsPlain.properties.uuid,
  title: t.Union([t.String(), t.Null()]),
  content: t.Union([t.String(), t.Null()]),
  rating: ProductCommentsPlain.properties.rating,
  images: t.Array(t.String()), // Yorum fotoğrafları
  user: t.Object({
    id: t.String(),
    name: t.String(),
    maskedName: t.String(), // Maskelenmiş isim (Emre S*****)
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
  images: t.Optional(
    t.Array(t.String(), {
      maxItems: 3,
      error: 'En fazla 3 fotoğraf yükleyebilirsiniz.',
    }),
  ),
});

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
    403: errorResponseDto[403],
    404: errorResponseDto[404],
    422: errorResponseDto[422],
  },
  detail: {
    summary: 'Create a product comment',
    description: 'Creates a new comment for a specific product.',
  },
} satisfies ControllerHook;

// Sipariş kontrolü endpoint'i için DTO
export const canReviewDto = {
  headers: headers,
  params: t.Object({
    id: t.String({
      format: 'uuid',
      error: 'Ürün ID geçerli bir UUID olmalıdır.',
    }),
  }),
  response: {
    200: t.Object({
      canReview: t.Boolean(),
      reason: t.Optional(t.String()),
    }),
    401: errorResponseDto[401],
    404: errorResponseDto[404],
  },
  detail: {
    summary: 'Check if user can review product',
    description: 'Checks if the authenticated user can review a specific product.',
  },
} satisfies ControllerHook;