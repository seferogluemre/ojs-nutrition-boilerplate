import { env } from '#/config/env';
import { treaty } from '@onlyjs/eden';
import { useAuthStore } from '#stores/authStore.js';

export const api = treaty(env.apiUrl, {
  fetch: {
    credentials: 'include',
  },
  headers: () => {
    const token = useAuthStore.getState().accessToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});