import { betterAuth } from '#modules/auth/authentication/instance';
import { ElysiaSwaggerConfig } from '@elysiajs/swagger';

export async function prepareSwaggerConfig({
  tags,
}: {
  tags: { name: string; description: string }[];
}) {
  const betterAuthJson = (await betterAuth.api.generateOpenAPISchema() as ElysiaSwaggerConfig["documentation"])!;

  const swaggerConfig: ElysiaSwaggerConfig = {
    documentation: {
      security: [],
      info: {
        title: process.env.APP_NAME ?? 'Boilerplate',
        description: process.env.APP_NAME + ' Boilerplate API documentation',
        version: process.env.npm_package_version ?? '0.0.1',
      },
      tags: [{ name: 'Better Auth', description: 'Better Auth endpoints' }, ...tags],
      components: {
        securitySchemes: {
          cookie: {
            type: 'apiKey',
            in: 'cookie',
            name: process.env.APP_SLUG + '.session_token',
            description: 'Session token',
          },
        },
        schemas: {},
      },
      // @ts-ignore
      paths: (function () {
        const paths = betterAuthJson.paths;
        const newPaths: typeof paths = {};

        for (const key in paths) {
          if (Object.hasOwn(paths, key)) {
            const newKey = `/auth${key}`;
            newPaths[newKey] = paths[key];
            const methods = newPaths[newKey];
            for (const method in methods) {
              if (Object.hasOwn(methods, method)) {
                // @ts-ignore
                methods[method].tags = ['Better Auth'];
              }
            }
          }
        }
        return newPaths;
      })(),
    },
  };

  return swaggerConfig;
}
