import { env } from '#/config/env';
import { treaty } from '@onlyjs/eden';

export const api = treaty(env.apiUrl, {
  fetch: {
    credentials: 'include',
  },
});