import { CategoryPlainInputCreate, CategoryPlainInputUpdate } from '#prismabox/Category';
import { t } from 'elysia';
import { ControllerHook, errorResponseDto, uuidValidation } from '../../utils';
import { paginationQueryDto, paginationResponseDto } from '../../utils/pagination';

// Sub-child category schema (3rd level)
const subChildCategorySchema = t.Object({
    name: t.String(),
    slug: t.String(),
    order: t.Number(),
});

// Child category schema (2nd level)
const childCategorySchema = t.Object({
    id: t.String(),
    name: t.String(),
    slug: t.String(),
    order: t.Number(),
    sub_children: t.Array(subChildCategorySchema),
});

// Top seller product schema
const topSellerSchema = t.Object({
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
    body: CategoryPlainInputCreate,
    response: { 200: categoryResponseDto, 422: errorResponseDto[422] },
    detail: {
        summary: 'Create',
        description: 'Yeni kategori oluşturur',
    },
} satisfies ControllerHook;

export const categoryUpdateDto = {
    params: t.Object({
        uuid: uuidValidation,
    }),
    body: CategoryPlainInputUpdate,
    response: { 200: categoryResponseDto, 404: errorResponseDto[404], 422: errorResponseDto[422] },
    detail: {
        summary: 'Update',
        description: 'Kategoriyi günceller',
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