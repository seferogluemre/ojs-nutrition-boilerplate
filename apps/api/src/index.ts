import cors from '@elysiajs/cors';
import staticPlugin from '@elysiajs/static';
import swagger from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import path from 'path';

import { loadEnv } from './config/env';
import { handleElysiaError } from './config/error-handler';
import { prepareSwaggerConfig } from './config/swagger.config';
import routes, { swaggerTags } from './modules';

loadEnv();

const app = new Elysia()
  .use(cors())
  .onError(handleElysiaError)
  .use(staticPlugin({
    assets: 'public',
    prefix: '/',
  }))
  .use(
    staticPlugin({
      assets: path.join(process.cwd(), 'public', 'storage'),
      prefix: '/storage',
    }),
  )
  .group('/api', (app) => app.use(routes))
  .listen(process.env.PORT ? parseInt(process.env.PORT) : 3000);

if (process.env.NODE_ENV === 'development') {
  const swaggerConfig = await prepareSwaggerConfig({ tags: swaggerTags });

  app.use(swagger(swaggerConfig));
}

console.log('🚀 Starting background services...');

// Worker'ı başlat (otomatik olarak queue'yu dinler)
console.log('👷 Email worker started and listening...');

// Cron'ları başlat  
console.log('⏰ CRON jobs activated');

console.log(
  `🦊 Elysia is running at ${app.server?.url.protocol}//${app.server?.hostname}:${app.server?.port} ${process.env.NODE_ENV} mode`,
);

export type App = typeof app;
