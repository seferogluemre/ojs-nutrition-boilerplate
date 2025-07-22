import { RolePlain } from '#prismabox/Role';
import { ControllerHook, errorResponseDto, prepareFilters, uuidValidation } from "#utils";
import { t } from 'elysia';
import { PERMISSION_KEYS } from './constants';

export const [roleFiltersDto, , filterRoles] = prepareFilters(RolePlain, {
    search: ['name', 'slug'],
    date: ['createdAt', 'updatedAt'],
});

const rolePermissionsDto = t.Union([t.Array(t.Literal("*"), {
    minItems: 1,
    maxItems: 1,
    uniqueItems: true,
}), t.Array(t.Union(PERMISSION_KEYS.map((key) => t.Literal(key))), {
    uniqueItems: true,
})]);

export const roleIndexDto = {
    query: roleFiltersDto,
    response: { 200: t.Array(RolePlain) },
    detail: {
        summary: 'Index',
    },
} satisfies ControllerHook;

export const roleShowDto = {
    params: t.Object({
        uuid: uuidValidation,
    }),
    response: { 200: RolePlain, 404: errorResponseDto[404] },
    detail: {
        summary: 'Show',
    },
} satisfies ControllerHook;
export const roleShowResponseDto = roleShowDto.response[200];

export const roleStoreDto = {
    body: t.Object({
        name: RolePlain.properties.name,
        description: RolePlain.properties.description,
        permissions: rolePermissionsDto,
        slug: t.Optional(RolePlain.properties.slug)
    }),
    response: { 200: RolePlain, 409: errorResponseDto[409], 422: errorResponseDto[422] },
    detail: {
        summary: 'Store',
    },
} satisfies ControllerHook;

export const roleUpdateDto = {
    params: t.Object({
        uuid: uuidValidation,
    }),
    body: t.Partial(
        t.Object({
            name: RolePlain.properties.name,
            description: RolePlain.properties.description,
            permissions: rolePermissionsDto,
        }),
    ),
    response: { 200: RolePlain, 404: errorResponseDto[404], 422: errorResponseDto[422] },
    detail: {
        summary: 'Update',
    },
} satisfies ControllerHook;

export const roleDestroyDto = {
    params: t.Object({
        uuid: uuidValidation,
    }),
    response: { 200: t.Object({ message: t.String() }), 404: errorResponseDto[404] },
    detail: {
        summary: 'Destroy',
    },
} satisfies ControllerHook;