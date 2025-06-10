import { Static } from 'elysia';
import { userRoleUpdateDto } from './dtos';

export type UserRoleUpdatePayload = Static<(typeof userRoleUpdateDto)['body']>;
