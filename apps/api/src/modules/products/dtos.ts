import { t } from 'elysia';
import { CategoryPlain } from '../../../prisma/prismabox/Category';
import { ProductPlain } from '../../../prisma/prismabox/Product';
import { ProductPhotoPlain } from '../../../prisma/prismabox/ProductPhoto';
import { headers } from '../../utils';
import { errorResponseDto } from '../../utils/common-dtos';
import { type ControllerHook } from '../../utils/elysia-types';

const uuid = t.String({ format: 'uuid', error: 'Geçerli bir UUID olmalıdır.' });

const categorySummarySchema = t.Object({
  id: CategoryPlain.properties.uuid,
  name: CategoryPlain.properties.name,
  slug: CategoryPlain.properties.slug,
});

const productPhotoSchema = t.Object({
  id: ProductPhotoPlain.properties.uuid,
  url: ProductPhotoPlain.properties.url,
  isPrimaryPhoto: ProductPhotoPlain.properties.isPrimaryPhoto,
  order: ProductPhotoPlain.properties.order,
  fileSize: ProductPhotoPlain.properties.fileSize,
});

const priceDetailsSchema = t.Object({
  profit: t.Union([t.Number(), t.Null()]),
  total_price: t.Number(),
  discounted_price: t.Union([t.Number(), t.Null()]),
  price_per_servings: t.Number(),
  discount_percentage: t.Union([t.Number(), t.Null()]),
});

const bestSellerProductResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  short_explanation: t.String(),
  slug: t.String(),
  price_info: t.Object({
    total_price: t.Number(),
    discounted_price: t.Optional(t.Number()),
    price_per_servings: t.Number(),
    discount_percentage: t.Optional(t.Number()),
  }),
  photo_src: t.String(),
  comment_count: t.Number(),
  average_star: t.Number(),
});

export const bestSellerProductSchema = {
  query: t.Object({
    limit: t.Optional(t.Number({ minimum: 1, maximum: 50, default: 10 })),
  }),
  response: { 200: t.Array(bestSellerProductResponseSchema) },
  detail: { summary: 'Get best seller products', description: 'Retrieves best selling products.' },
} satisfies ControllerHook;

const nutritionalContentSchema = t.Optional(t.Object({
  ingredients: t.Optional(t.Array(t.Object({
    aroma: t.Union([t.String(), t.Null()]),
    value: t.String(),
  }))),
  nutrition_facts: t.Optional(t.Object({
    ingredients: t.Optional(t.Array(t.Object({
      name: t.String(),
      amounts: t.Optional(t.Union([
        t.Array(t.Union([t.String(), t.Null()])),
        t.String(),
        t.Null()
      ])),
    }))),
    portion_sizes: t.Optional(t.Union([
      t.Array(t.Union([t.String(), t.Null()])),
      t.String(),
      t.Null()
    ])),
  })),
  amino_acid_facts: t.Optional(t.Any()),
}));

const explanationSchema = t.Object({
  usage: t.Optional(t.String()),
  features: t.Optional(t.String()),
  description: t.Optional(t.String()),
  nutritional_content: nutritionalContentSchema,
});

const variantSchema = t.Object({
  id: t.String(),
  name: t.String(),
  size: t.Optional(t.Object({
    pieces: t.Number(),
    total_services: t.Number(),
  })),
  aroma: t.Optional(t.String()),
  price: t.Optional(priceDetailsSchema),
  photo_src: t.Optional(t.String()),
  is_available: t.Boolean(),
});

const productBaseSchema = {
  name: t.String({ minLength: 2, maxLength: 100, error: 'Ürün adı 2-100 karakter arasında olmalıdır.' }),
  slug: t.String({ minLength: 2, maxLength: 100, error: 'Slug 2-100 karakter arasında olmalıdır.' }),
  stock: t.Number({ minimum: 0, error: 'Stok sıfır veya pozitif bir sayı olmalıdır.' }),
  variant: t.Optional(t.Union([t.String({ maxLength: 100, error: 'Varyant en fazla 100 karakter olmalıdır.' }), t.Null()])),
  shortDescription: t.String({ maxLength: 50, error: 'Kısa açıklama en fazla 50 karakter olmalıdır.' }),
  longDescription: t.String({ maxLength: 250, error: 'Uzun açıklama en fazla 250 karakter olmalıdır.' }),
  price: t.Number({ minimum: 0, error: 'Fiyat sıfır veya pozitif bir sayı olmalıdır.' }),
  primaryPhotoUrl: t.Optional(t.String({ maxLength: 255, error: 'Ana fotoğraf URL\'si en fazla 255 karakter olmalıdır.' })),
  isActive: t.Optional(t.Boolean()),
  explanation: t.Optional(explanationSchema),
  mainCategoryId: t.Optional(t.String()),
  subCategoryId: t.Optional(t.String()),
  tags: t.Optional(t.Array(t.String())),
};

export const productResponseSchema = t.Object({
  id: ProductPlain.properties.uuid,
  ...productBaseSchema,
  short_explanation: ProductPlain.properties.shortDescription,
  category: categorySummarySchema,
  photos: t.Array(productPhotoSchema),
  variants: t.Array(variantSchema),
  comment_count: t.Number(),
  average_star: t.Number(),
  reviewCount: ProductPlain.properties.reviewCount,
  averageRating: ProductPlain.properties.averageRating,
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const productCreateSchema = t.Object({
  categoryId: uuid,
  ...productBaseSchema,
});

export const productUpdateSchema = t.Object({
  categoryId: t.Optional(uuid),
  ...Object.fromEntries(
    Object.entries(productBaseSchema).map(([key, schema]) => [key, t.Optional(schema)])
  ),
});

export const productIndexQuerySchema = t.Object({
  main_category: t.Optional(uuid),
  isActive: t.Optional(t.Boolean()),
  priceMin: t.Optional(t.Number({ minimum: 0 })),
  priceMax: t.Optional(t.Number({ minimum: 0 })),
  search: t.Optional(t.String({ minLength: 1 })),
  sortBy: t.Optional(t.Union([
    t.Literal('createdAt'),
    t.Literal('price'),
    t.Literal('name'),
    t.Literal('averageRating'),
    t.Literal('reviewCount'),
  ])),
  sortDirection: t.Optional(t.Union([t.Literal('asc'), t.Literal('desc')])),
  page: t.Optional(t.Number({ minimum: 1 })),
  limit: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
});

export const paginatedProductResponseSchema = t.Object({
  data: t.Array(productResponseSchema),
  meta: t.Object({
    page: t.Number(),
    limit: t.Number(),
    total: t.Number(),
    totalPages: t.Number(),
    hasNext: t.Boolean(),
    hasPrev: t.Boolean(),
  }),
});

export const productIndexDto = {
  query: productIndexQuerySchema,
  response: { 200: paginatedProductResponseSchema },
  detail: { summary: 'Get all products', description: 'List with filters, sort and pagination.' },
} satisfies ControllerHook;

export const productShowDto = {
  params: t.Object({ id: uuid }),
  response: { 200: productResponseSchema, 404: errorResponseDto[404] },
  detail: { summary: 'Get a product by ID', description: 'Retrieves a single product by its UUID.' },
} satisfies ControllerHook;

export const productCreateDto = {
  headers,
  body: productCreateSchema,
  response: { 201: productResponseSchema, 400: errorResponseDto[400], 422: errorResponseDto[422] },
  detail: { summary: 'Create product', description: 'Creates a new product.' },
} satisfies ControllerHook;

export const productUpdateDto = {
  headers,
  params: t.Object({ id: uuid }),
  body: productUpdateSchema,
  response: { 200: productResponseSchema, 400: errorResponseDto[400], 404: errorResponseDto[404], 422: errorResponseDto[422] },
  detail: { summary: 'Update product', description: 'Updates product by ID.' },
} satisfies ControllerHook;

export const productDestroyDto = {
  headers,
  params: t.Object({ id: uuid }),
  response: { 200: t.Object({ message: t.String() }), 404: errorResponseDto[404] },
  detail: { summary: 'Delete product', description: 'Deletes product by UUID.' },
} satisfies ControllerHook;

export const productFeaturedDto = {
  query: t.Object({
    limit: t.Optional(t.Number({ minimum: 1, maximum: 50, default: 10 })),
  }),
  response: { 200: t.Array(productResponseSchema) },
  detail: { summary: 'Get featured products', description: 'Retrieves featured products.' },
} satisfies ControllerHook;

export const productByCategoryDto = {
  params: t.Object({ categoryId: t.String({ pattern: '^[0-9]+$', error: 'Kategori ID geçerli bir sayı olmalıdır.' }) }),
  response: { 200: t.Array(productResponseSchema), 404: errorResponseDto[404] },
  detail: { summary: 'Get products by category', description: 'Retrieves products from a category.' },
} satisfies ControllerHook;

export const productStockUpdateDto = {
  headers,
  params: t.Object({ id: uuid }),
  body: t.Object({
    stock: t.Number({ minimum: 0, error: 'Stok sıfır veya pozitif bir sayı olmalıdır.' }),
  }),
  response: {
    200: productResponseSchema,
    400: errorResponseDto[400],
    404: errorResponseDto[404],
    422: errorResponseDto[422],
  },
  detail: { summary: 'Update stock', description: 'Updates stock of product.' },
} satisfies ControllerHook;