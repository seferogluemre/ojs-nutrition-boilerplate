import { ProductVariantPlain } from "#prismabox/ProductVariant";
import { ControllerHook, errorResponseDto, headers } from "#utils";
import { t } from "elysia";



const variantResponseSchema = t.Object({
    id: t.String(),
    name: ProductVariantPlain.properties.name,
    aroma: ProductVariantPlain.properties.aroma,
    price: t.Optional(ProductVariantPlain.properties.price),
    createdAt: t.Date(),
    updatedAt: t.Date(),
})

export const getProductVariantsDto = {
    headers: headers,
    params: t.Object({
        id: t.String({
            format: 'uuid',
            error: 'id geçerli bir UUID olmalıdır.',
        }),
    }),
    response: {
        200: t.Array(variantResponseSchema),
        404: errorResponseDto[404],
    },
    detail: {
        summary: 'Get product variants',
        description: 'Retrieves all variants for a specific product.',
    },
} satisfies ControllerHook;


// POST /api/products/:id/variants
export const createVariantDto = {
    headers: headers,
    params: t.Object({
        id: t.String({
            format: 'uuid',
            error: 'id geçerli bir UUID olmalıdır.',
        }),
    }),
    body: t.Object({
        name: t.String({
            minLength: 1,
            maxLength: 100,
            error: 'Varyant adı 1-100 karakter arası olmalıdır.',
        }),
        aroma: t.String({
          minLength: 1,
          maxLength: 100,
          error: 'Aroma adı 1-100 karakter arası olmalıdır.',
        }),
        price: t.Optional(t.Any({
          description: 'Price information as JSON object'
        })),
    }),
    response: {
        201: variantResponseSchema,
        400: errorResponseDto[400],
        404: errorResponseDto[404],
    },
    detail: {
        summary: 'Create product variant',
        description: 'Creates a new variant for a product.',
    },
} satisfies ControllerHook;


// PUT /api/variants/:id
export const updateVariantDto = {
  headers: headers,
  params: t.Object({
    id: t.String({
      format: 'uuid',
      error: 'id geçerli bir UUID olmalıdır.',
    }),
  }),
  body: t.Object({
    name: t.String({
      minLength: 1,
      maxLength: 100,
      error: 'Varyant adı 1-100 karakter arası olmalıdır.',
    }),
  }),
  response: {
    200: variantResponseSchema,
    400: errorResponseDto[400],
    404: errorResponseDto[404],
  },
  detail: {
    summary: 'Update variant',
    description: 'Updates an existing product variant.',
  },
} satisfies ControllerHook;

// DELETE /api/variants/:id
export const deleteVariantDto = {
  headers: headers,
  params: t.Object({
    id: t.String({
      format: 'uuid',
      error: 'id geçerli bir UUID olmalıdır.',
    }),
  }),
  query: t.Object({
    product_id: t.String({
      format: 'uuid',
      error: 'product_id geçerli bir UUID olmalıdır.',
    }),
  }),
  response: {
    200: t.Object({
      message: t.String(),
    }),
    400: errorResponseDto[400],
    404: errorResponseDto[404],
  },
  detail: {
    summary: 'Delete variant',
    description: 'Deletes a product variant.',
  },
} satisfies ControllerHook;