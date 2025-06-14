import { Static } from 'elysia';

import { AuthResponse, loginDto, signUpDto } from './dtos';

export type LoginPayload = Static<(typeof loginDto)['body']>;
export type SignUpPayload = Static<(typeof signUpDto)['body']>;
export type AuthResponseType = Static<typeof AuthResponse>;
