import { t } from 'elysia';
import { ControllerHook, errorResponseDto } from '../../utils';
import { userResponseSchema } from '../users/dtos';

// Controller Hooks
export const initialUserSetupDto = {
    response: {
        200: t.Object({
            user: userResponseSchema,
        }),
        410: errorResponseDto[410],
    },
    detail: {
        summary: 'Initial System Setup',
        description: 'Creates the first admin user and role',
    },
} satisfies ControllerHook;
