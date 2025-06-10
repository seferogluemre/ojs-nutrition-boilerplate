import { ControllerHook, errorResponseDto } from '../../../utils';
import { t } from 'elysia';
import { userResponseSchema } from '../dtos';

export const userRoleUpdateDto = {
    params: t.Object({
        id: t.String(),
    }),
    body: t.Object({
        rolesSlugs: t.Array(t.String()),
    }),
    response: {
        200: userResponseSchema,
        404: errorResponseDto[404],
        422: errorResponseDto[422],
    },
    detail: {
        summary: 'Update User Roles',
    },
} satisfies ControllerHook;