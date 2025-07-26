import { t } from 'elysia';
import { ControllerHook, errorResponseDto, uuidValidation } from '../../utils';
import { paginationQueryDto, paginationResponseDto } from '../../utils/pagination';

const subChildCategorySchema = t.Object({
    id: t.String(),
    name: t.String(),
    slug: t.String(),
    order: t.Number(),
});

const childCategorySchema = t.Object({
    id: t.String(),
    name: t.String(),
    slug: t.String(),
    order: t.Number(),
    sub_children: t.Array(subChildCategorySchema),
});

const topSellerSchema = t.Object({
    id: t.String(),
    name: t.String(),
    slug: t.String(),
    description: t.String(),
    picture_src: t.String(),
});

// Main category response schema (1st level)
export const categoryResponseDto = t.Object({
    id: t.String(),
    name: t.String(),
    slug: t.String(),
    order: t.Number(),
    children: t.Array(childCategorySchema),
    top_sellers: t.Array(topSellerSchema),
});

export const categoryIndexDto = {
    query: t.Object({
        ...paginationQueryDto.properties,
        search: t.Optional(t.String()),
    }),
    response: {
        200: paginationResponseDto(categoryResponseDto),
    },
    detail: {
        summary: 'Index',
        description: 'Kategorilerin hierarşik listesini döndürür',
    },
} satisfies ControllerHook;

export const categoryCreateDto = {
    body: t.Object({
        name: t.String({
            minLength: 2,
            maxLength: 100,
            error: 'Kategori adı 2-100 karakter arasında olmalıdır.'
        }),
        slug: t.String({
            minLength: 2,
            maxLength: 100,
            error: 'Slug 2-100 karakter arasında olmalıdır.'
        }),
        parentId: t.Optional(t.String({
            format: 'uuid',
            error: 'Parent ID geçerli bir UUID olmalıdır.'
        })),
        order: t.Optional(t.Number({
            minimum: 0,
            error: 'Sıra numarası 0 veya pozitif olmalıdır.'
        }))
    }),
    response: { 200: categoryResponseDto, 422: errorResponseDto[422] },
    detail: {
        summary: 'Create',
        description: 'Yeni kategori oluşturur (parent belirtilerek hiyerarşik yapı desteklenir)',
    },
} satisfies ControllerHook;

export const categoryUpdateDto = {
    params: t.Object({
        uuid: uuidValidation,
    }),
    body: t.Object({
        name: t.Optional(t.String({
            minLength: 2,
            maxLength: 100,
            error: 'Kategori adı 2-100 karakter arasında olmalıdır.'
        })),
        slug: t.Optional(t.String({
            minLength: 2,
            maxLength: 100,
            error: 'Slug 2-100 karakter arasında olmalıdır.'
        })),
        parentId: t.Optional(t.String({
            format: 'uuid',
            error: 'Parent ID geçerli bir UUID olmalıdır.'
        })),
        order: t.Optional(t.Number({
            minimum: 0,
            error: 'Sıra numarası 0 veya pozitif olmalıdır.'
        }))
    }),
    response: { 200: categoryResponseDto, 404: errorResponseDto[404], 422: errorResponseDto[422] },
    detail: {
        summary: 'Update',
        description: 'Kategoriyi günceller (parent değiştirilerek hiyerarşi değiştirilebilir)',
    },
} satisfies ControllerHook;

export const categoryShowDto = {
    params: t.Object({
        uuid: uuidValidation,
    }),
    response: { 200: categoryResponseDto, 404: errorResponseDto[404] },
    detail: {
        summary: 'Show',
        description: 'Kategori detaylarını döndürür',
    },
} satisfies ControllerHook;

export const categoryDestroyDto = {
    ...categoryShowDto,
    response: { 200: t.Object({ message: t.String() }), 404: errorResponseDto[404] },
    detail: {
        summary: 'Destroy',
        description: 'Kategoriyi siler',
    },
} satisfies ControllerHook;