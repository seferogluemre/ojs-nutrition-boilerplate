import { Elysia } from 'elysia';

import { CustomerService } from '../customer/service';
import { loginDto, logoutDto, refreshTokenDto, signUpDto } from './dtos';
import { CustomerAuthFormatter } from './formatters';
import { LoginPayload, SignUpPayload } from './types';

const authController = new Elysia({ prefix: '/auth' })

  // Customer Sign Up
  .post(
    '/signup',
    async ({ body, set }) => {
      try {
        const payload = body as SignUpPayload;
        const result = await CustomerService.signUp(payload);

        set.status = 200;
        return CustomerAuthFormatter.authResponse(result);
      } catch (error: any) {
        set.status = error.status || 400;
        throw error;
      }
    },
    {
      ...signUpDto,
      detail: {
        ...signUpDto.detail,
        tags: ['Customer Auth'],
      },
    },
  )

  // Customer Login
  .post(
    '/login',
    async ({ body, set }) => {
      try {
        const payload = body as LoginPayload;
        const result = await CustomerService.login(payload);

        set.status = 200;
        return CustomerAuthFormatter.authResponse(result);
      } catch (error: any) {
        set.status = error.status || 401;
        throw error;
      }
    },
    {
      ...loginDto,
      detail: {
        ...loginDto.detail,
        tags: ['Customer Auth'],
      },
    },
  )

  // Customer Logout
  .post(
    '/logout',
    async ({ headers, set }) => {
      try {
        const authHeader = headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          set.status = 401;
          throw new Error('No token provided');
        }

        const token = authHeader.split(' ')[1];
        await CustomerService.logout(token);

        set.status = 200;
        return CustomerAuthFormatter.logoutResponse();
      } catch (error: any) {
        set.status = error.status || 401;
        throw error;
      }
    },
    {
      ...logoutDto,
      detail: {
        ...logoutDto.detail,
        tags: ['Customer Auth'],
      },
    },
  )

  // Refresh Token
  .post(
    '/refresh',
    async ({ body, set }) => {
      try {
        const { refreshToken } = body as { refreshToken: string };
        const result = await CustomerService.refreshToken(refreshToken);

        set.status = 200;
        return CustomerAuthFormatter.tokenResponse(result);
      } catch (error: any) {
        set.status = error.status || 401;
        throw error;
      }
    },
    {
      ...refreshTokenDto,
      detail: {
        ...refreshTokenDto.detail,
        tags: ['Customer Auth'],
      },
    },
  );

export default authController;
