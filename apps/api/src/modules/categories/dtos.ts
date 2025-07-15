import { CategoryPlain, CategoryPlainInputCreate, CategoryPlainInputUpdate } from '#prismabox/Category';
import { t } from 'elysia';
import { ControllerHook, errorResponseDto, uuidValidation } from '../../utils';
import { paginationQueryDto, paginationResponseDto } from '../../utils/pagination';


export const categoryResponseDto = t.Composite([
    CategoryPlain,
    t.Object({
        products: t.Array(t.Object({
            id: t.String(),
            name: t.String(),
        })),
    }),
]);

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
        description: 'Kategorilerin listesini döndürür',
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