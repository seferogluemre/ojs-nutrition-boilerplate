import { ProductPlain } from '#prismabox/Product';
import { t } from 'elysia';

import { CategoryPlain } from '#prismabox/Category';
import { ProductPhotoPlain } from '#prismabox/ProductPhoto';
import { headers } from '../../utils';
import { errorResponseDto } from '../../utils/common-dtos';
import { type ControllerHook } from '../../utils/elysia-types';

// Response schemas
export const productResponseSchema = t.Object({
  id: ProductPlain.properties.uuid,
  name: ProductPlain.properties.name,
  slug: ProductPlain.properties.slug,
  short_explanation: ProductPlain.properties.shortDescription,
  explanation: t.Optional(t.Object({
    usage: t.Optional(t.String()),
    features: t.Optional(t.String()),
    description: t.Optional(t.String()),
    nutritional_content: t.Optional(t.Object({
      ingredients: t.Optional(t.Array(t.Object({
        aroma: t.Union([t.String(), t.Null()]),
        value: t.String()
      }))),
      nutrition_facts: t.Optional(t.Object({
        ingredients: t.Array(t.Object({
          name: t.String(),
          amounts: t.Array(t.String())
        })),
        portion_sizes: t.Array(t.String())
      })),
      amino_acid_facts: t.Optional(t.Any())
    }))
  })),
  main_category_id: t.Optional(t.String()),
  sub_category_id: t.Optional(t.String()),
  tags: t.Array(t.String()),
  stock: ProductPlain.properties.stock,
  variant: ProductPlain.properties.variant,
  isActive: ProductPlain.properties.isActive,
  shortDescription: ProductPlain.properties.shortDescription,
  longDescription: ProductPlain.properties.longDescription,
  price: ProductPlain.properties.price,
  primaryPhotoUrl: ProductPlain.properties.primaryPhotoUrl,
  reviewCount: ProductPlain.properties.reviewCount,
  averageRating: ProductPlain.properties.averageRating,
  category: t.Object({
    id: CategoryPlain.properties.uuid,
    name: CategoryPlain.properties.name,
    slug: CategoryPlain.properties.slug,
  }),
  photos: t.Array(t.Object({
    id: ProductPhotoPlain.properties.uuid,
    url: ProductPhotoPlain.properties.url,
    isPrimaryPhoto: ProductPhotoPlain.properties.isPrimaryPhoto,
    order: ProductPhotoPlain.properties.order,
    fileSize: ProductPhotoPlain.properties.fileSize,
  })),
  variants: t.Array(t.Object({
    id: t.String(),
    name: t.String(),
    size: t.Optional(t.Object({
      pieces: t.Number(),
      total_services: t.Number()
    })),
    aroma: t.Optional(t.String()),
    price: t.Optional(t.Object({
      profit: t.Union([t.Number(), t.Null()]),
      total_price: t.Number(),
      discounted_price: t.Union([t.Number(), t.Null()]),
      price_per_servings: t.Number(),
      discount_percentage: t.Union([t.Number(), t.Null()]),
    })),
    photo_src: t.Optional(t.String()),
    is_available: t.Boolean(),
  })),
  comment_count: t.Number(),
  average_star: t.Number(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const bestSellerResponseSchema=t.Object({
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
})

export const bestSellersDto = {
  query: t.Object({
    limit: t.Optional(
      t.Number({
        minimum: 1,
        maximum: 50,
        default: 10,
        error: 'Limit 1-50 arasında olmalıdır.',
      }),
    ),
  }),
  response: {
      200: t.Array(t.Object({
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
    })),
  },
  detail: {
    summary: 'Get best-selling products',
    description: 'Retrieves a list of best-selling products with their details.',
  },
} satisfies ControllerHook;

// Create product schema
export const productCreateSchema = t.Object({
  categoryId: t.String({
    format: 'uuid',
    error: 'Kategori ID geçerli bir UUID olmalıdır.',
  }),
  name: t.String({
    minLength: 2,
    maxLength: 100,
    error: 'Ürün adı 2-100 karakter arasında olmalıdır.',
  }),
  slug: t.String({
    minLength: 2,
    maxLength: 100,
    error: 'Slug 2-100 karakter arasında olmalıdır.',
  }),
  stock: t.Number({
    minimum: 0,
    error: 'Stok sıfır veya pozitif bir sayı olmalıdır.',
  }),
  variant: t.Optional(
    t.String({
      maxLength: 100,
      error: 'Varyant en fazla 100 karakter olmalıdır.',
    }),
  ),
  shortDescription: t.String({
    maxLength: 50,
    error: 'Kısa açıklama en fazla 50 karakter olmalıdır.',
  }),
  longDescription: t.String({
    maxLength: 250,
    error: 'Uzun açıklama en fazla 250 karakter olmalıdır.',
  }),
  price: t.Number({
    minimum: 0,
    error: 'Fiyat sıfır veya pozitif bir sayı olmalıdır.',
  }),
  primaryPhotoUrl: t.Optional(t.String({
    maxLength: 255,
    error: "Ana fotoğraf URL'si en fazla 255 karakter olmalıdır.",
  })),
  isActive: t.Optional(t.Boolean()),
  
  // YENİ ALANLAR
  explanation: t.Optional(t.Object({
    usage: t.Optional(t.String()),
    features: t.Optional(t.String()),
    description: t.Optional(t.String()),
    nutritional_content: t.Optional(t.Object({
      ingredients: t.Optional(t.Array(t.Object({
        aroma: t.Union([t.String(), t.Null()]),
        value: t.String()
      }))),
      nutrition_facts: t.Optional(t.Object({
        ingredients: t.Array(t.Object({
          name: t.String(),
          amounts: t.Array(t.String())
        })),
        portion_sizes: t.Array(t.String())
      })),
      amino_acid_facts: t.Optional(t.Any())
    }))
  })),
  mainCategoryId: t.Optional(t.String()),
  subCategoryId: t.Optional(t.String()),
  tags: t.Optional(t.Array(t.String()))
});

// Update product schema
export const productUpdateSchema = t.Object({
  categoryId: t.Optional(
    t.String({
      format: 'uuid',
      error: 'Kategori ID geçerli bir UUID olmalıdır.',
    }),
  ),
  name: t.Optional(
    t.String({
      minLength: 2,
      maxLength: 100,
      error: 'Ürün adı 2-100 karakter arasında olmalıdır.',
    }),
  ),
  slug: t.Optional(
    t.String({
      minLength: 2,
      maxLength: 100,
      error: 'Slug 2-100 karakter arasında olmalıdır.',
    }),
  ),
  stock: t.Optional(
    t.Number({
      minimum: 0,
      error: 'Stok sıfır veya pozitif bir sayı olmalıdır.',
    }),
  ),
  variant: t.Optional(
    t.String({
      maxLength: 100,
      error: 'Varyant en fazla 100 karakter olmalıdır.',
    }),
  ),
  shortDescription: t.Optional(
    t.String({
      maxLength: 50,
      error: 'Kısa açıklama en fazla 50 karakter olmalıdır.',
    }),
  ),
  longDescription: t.Optional(
    t.String({
      maxLength: 250,
      error: 'Uzun açıklama en fazla 250 karakter olmalıdır.',
    }),
  ),
  price: t.Optional(
    t.Number({
      minimum: 0,
      error: 'Fiyat sıfır veya pozitif bir sayı olmalıdır.',
    }),
  ),
  primaryPhotoUrl: t.Optional(
    t.String({
      maxLength: 255,
      error: "Ana fotoğraf URL'si en fazla 255 karakter olmalıdır.",
    }),
  ),
  isActive: t.Optional(t.Boolean()),
  
  // YENİ ALANLAR
  explanation: t.Optional(t.Object({
    usage: t.Optional(t.String()),
    features: t.Optional(t.String()),
    description: t.Optional(t.String()),
    nutritional_content: t.Optional(t.Object({
      ingredients: t.Optional(t.Array(t.Object({
        aroma: t.Union([t.String(), t.Null()]),
        value: t.String()
      }))),
      nutrition_facts: t.Optional(t.Object({
        ingredients: t.Array(t.Object({
          name: t.String(),
          amounts: t.Array(t.String())
        })),
        portion_sizes: t.Array(t.String())
      })),
      amino_acid_facts: t.Optional(t.Any())
    }))
  })),
  mainCategoryId: t.Optional(t.String()),
  subCategoryId: t.Optional(t.String()),
  tags: t.Optional(t.Array(t.String()))
});

// Query parameters schema for index
export const productIndexQuerySchema = t.Object({
  main_category: t.Optional(
    t.String({
      format: 'uuid',
      error: 'Kategori ID geçerli bir UUID olmalıdır.',
    }),
  ),
  isActive: t.Optional(t.Boolean()),
  priceMin: t.Optional(
    t.Number({
      minimum: 0,
      error: 'Minimum fiyat sıfır veya pozitif bir sayı olmalıdır.',
    }),
  ),
  priceMax: t.Optional(
    t.Number({
      minimum: 0,
      error: 'Maksimum fiyat sıfır veya pozitif bir sayı olmalıdır.',
    }),
  ),
  search: t.Optional(
    t.String({
      minLength: 1,
      error: 'Arama terimi en az 1 karakter olmalıdır.',
    }),
  ),
  sortBy: t.Optional(
    t.Union([
      t.Literal('createdAt'),
      t.Literal('price'),
      t.Literal('name'),
      t.Literal('averageRating'),
      t.Literal('reviewCount'),
    ]),
  ),
  sortDirection: t.Optional(t.Union([t.Literal('asc'), t.Literal('desc')])),
  page: t.Optional(
    t.Number({
      minimum: 1,
      error: 'Sayfa numarası 1 veya daha büyük olmalıdır.',
    }),
  ),
  limit: t.Optional(
    t.Number({
      minimum: 1,
      maximum: 100,
      error: 'Limit 1-100 arasında olmalıdır.',
    }),
  ),
});

// Pagination response schema
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

// DTO definitions
export const productIndexDto = {
  query: productIndexQuerySchema,
  response: {
    200: paginatedProductResponseSchema,
  },
  detail: {
    summary: 'Get all products',
    description: 'Retrieves a list of all products with filtering, sorting and pagination options.',
  },
} satisfies ControllerHook;

export const productShowDto = {
  params: t.Object({
    id: t.String({
      format: 'uuid',
      error: 'Ürün ID geçerli bir UUID olmalıdır.',
    }),
  }),
  response: {
    200: productResponseSchema,
    404: errorResponseDto[404],
  },
  detail: {
    summary: 'Get a product by ID',
    description: 'Retrieves a single product by its UUID.',
  },
} satisfies ControllerHook;

export const productCreateDto = {
  headers: headers,
  body: productCreateSchema,
  response: {
    201: productResponseSchema,
    400: errorResponseDto[400],
    422: errorResponseDto[422],
  },
  detail: {
    summary: 'Create a new product',
    description: 'Creates a new product with the provided data.',
  },
} satisfies ControllerHook;

export const productUpdateDto = {
  headers: headers,
  params: t.Object({
    id: t.String({
      format: 'uuid',
      error: 'Ürün ID geçerli bir UUID olmalıdır.',
    }),
  }),
  body: productUpdateSchema,
  response: {
    200: productResponseSchema,
    400: errorResponseDto[400],
    404: errorResponseDto[404],
    422: errorResponseDto[422],
  },
  detail: {
    summary: 'Update a product',
    description: 'Updates an existing product with the provided data.',
  },
} satisfies ControllerHook;

export const productDestroyDto = {
  headers: headers,
  params: t.Object({
    id: t.String({
      format: 'uuid',
      error: 'Ürün ID geçerli bir UUID olmalıdır.',
    }),
  }),
  response: {
    200: t.Object({
      message: t.String(),
    }),
    404: errorResponseDto[404],
  },
  detail: {
    summary: 'Delete a product',
    description: 'Deletes a product by its UUID.',
  },
} satisfies ControllerHook;

// Featured products DTO
export const productFeaturedDto = {
  query: t.Object({
    limit: t.Optional(
      t.Number({
        minimum: 1,
        maximum: 50,
        default: 10,
        error: 'Limit 1-50 arasında olmalıdır.',
      }),
    ),
  }),
  response: {
    200: t.Array(productResponseSchema), // Bu endpoint basit array döndürür (pagination yok)
  },
  detail: {
    summary: 'Get featured products',
    description: 'Retrieves a list of featured products (highly rated or best selling).',
  },
} satisfies ControllerHook;

// Products by category DTO
export const productByCategoryDto = {
  params: t.Object({
    categoryId: t.String({
      pattern: '^[0-9]+$',
      error: 'Kategori ID geçerli bir sayı olmalıdır.',
    }),
  }),
  response: {
    200: t.Array(productResponseSchema),
    404: errorResponseDto[404],
  },
  detail: {
    summary: 'Get products by category',
    description: 'Retrieves all active products from a specific category.',
  },
} satisfies ControllerHook;

// Stock update DTO
export const productStockUpdateDto = {
  headers: headers,
  params: t.Object({
    id: t.String({
      format: 'uuid',
      error: 'Ürün ID geçerli bir UUID olmalıdır.',
    }),
  }),
  body: t.Object({
    stock: t.Number({
      minimum: 0,
      error: 'Stok sıfır veya pozitif bir sayı olmalıdır.',
    }),
  }),
  response: {
    200: productResponseSchema,
    400: errorResponseDto[400],
    404: errorResponseDto[404],
    422: errorResponseDto[422],
  },
  detail: {
    summary: 'Update product stock',
    description: 'Updates the stock quantity of a specific product.',
  },
} satisfies ControllerHook;