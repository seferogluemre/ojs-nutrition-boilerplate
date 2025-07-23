import { t } from 'elysia';

import { ControllerHook, errorResponseDto } from '../../../utils';

// Safe customer response (without password and refreshToken)
export const SafeCustomerResponse = t.Object({
  id: t.Integer(),
  uuid: t.String(),
  firstName: t.String({ minLength: 2, maxLength: 50 }),
  lastName: t.String({ minLength: 2, maxLength: 50 }),
  name: t.String({ minLength: 2, maxLength: 101 }),
  username: t.String({ minLength: 2, maxLength: 100 }),
  email: t.String({ minLength: 2, maxLength: 100 }),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

// Token response tipleri
export const TokenResponse = t.Object({
  accessToken: t.String(),
  refreshToken: t.String(),
});

export const AuthResponse = t.Object({
  customer: SafeCustomerResponse,
  ...TokenResponse.properties,
});

export const signUpDto = {
  body: t.Object({
    firstName: t.String({ minLength: 2, maxLength: 50 }),
    lastName: t.String({ minLength: 2, maxLength: 50 }),
    username: t.String({ minLength: 2, maxLength: 100 }),
    email: t.String({ format: 'email' }),
    password: t.String({ minLength: 6, maxLength: 20 }),
  }),
  response: {
    200: AuthResponse,
    422: errorResponseDto[422],
  },
  detail: {
    summary: 'Create',
    description: 'Yeni müşteri oluşturur',
  },
} satisfies ControllerHook;

const CustomerPlainInputLogin = t.Object({
  email: t.String({ format: 'email' }),
  password: t.String(),
});

export const loginDto = {
  body: CustomerPlainInputLogin,
  response: {
    200: AuthResponse,
    422: errorResponseDto[422],
  },
  detail: {
    summary: 'Login',
    description: 'Müşteri girişi yapar',
  },
} satisfies ControllerHook;

export const logoutDto = {
  response: {
    200: t.Object({ message: t.String(), success: t.Boolean() }),
    422: errorResponseDto[422],
    401: errorResponseDto[401],
  },
  detail: {
    summary: 'Logout',
    description: 'Müşteri çıkışı yapar',
  },
} satisfies ControllerHook;

export const refreshTokenDto = {
  body: t.Object({
    refreshToken: t.String(),
  }),
  response: { 200: TokenResponse, 422: errorResponseDto[422], 401: errorResponseDto[401] },
  detail: {
    summary: 'Refresh Token',
    description: 'Müşteri token yeniler',
  },
} satisfies ControllerHook;
