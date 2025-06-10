import { t } from 'elysia';
import { ControllerHook, errorResponseDto, uuidValidation } from '../../utils';
import { paginationQueryDto, paginationResponseDto } from '../../utils/pagination';
import { PostPlain, PostPlainInputCreate, PostPlainInputUpdate } from '#prismabox/Post';


export const postResponseDto = t.Composite([
    PostPlain,
    t.Object({
        author: t.Object({
            id: t.String(),
            name: t.String(),
        }),
    }),
]);

export const postIndexDto = {
    query: t.Object({
        ...paginationQueryDto.properties,
        search: t.Optional(t.String()),
    }),
    response: {
        200: paginationResponseDto(postResponseDto),
    },
    detail: {
        summary: 'Index',
        description: 'Gönderilerin listesini döndürür',
    },
} satisfies ControllerHook;

export const postCreateDto = {
    body: PostPlainInputCreate,
    response: { 200: postResponseDto, 422: errorResponseDto[422] },
    detail: {
        summary: 'Create',
        description: 'Yeni gönderi oluşturur',
    },
} satisfies ControllerHook;

export const postUpdateDto = {
    params: t.Object({
        uuid: uuidValidation,
    }),
    body: PostPlainInputUpdate,
    response: { 200: postResponseDto, 404: errorResponseDto[404], 422: errorResponseDto[422] },
    detail: {
        summary: 'Update',
        description: 'Gönderiyi günceller',
    },
} satisfies ControllerHook;

export const postShowDto = {
    params: t.Object({
        uuid: uuidValidation,
    }),
    response: { 200: postResponseDto, 404: errorResponseDto[404] },
    detail: {
        summary: 'Show',
        description: 'Gönderi detaylarını döndürür',
    },
} satisfies ControllerHook;

export const postDestroyDto = {
    ...postShowDto,
    response: { 200: t.Object({ message: t.String() }), 404: errorResponseDto[404] },
    detail: {
        summary: 'Destroy',
        description: 'Gönderiyi siler',
    },
} satisfies ControllerHook;