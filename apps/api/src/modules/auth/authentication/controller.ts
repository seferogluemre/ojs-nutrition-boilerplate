import { Context, Elysia, NotFoundError } from 'elysia';
import { auth, authSwagger } from './plugin';
import { UserFormatter } from '../../users';
import { betterAuth } from './instance';
import { prisma } from '#core';

const app = new Elysia({
    prefix: '/auth',
    detail: {
        tags: ['Auth'],
    },
})
    .guard(authSwagger, (app) =>
        app
            .use(auth())
            .get(
                '/me',
                async ({ user }) => {
                    const fullUser = await prisma.user.findUnique({
                        where: {
                            id: user.id,
                        },
                    });
                    if (!fullUser) {
                        throw new NotFoundError('User not found');
                    }
                    const response = UserFormatter.response(fullUser!);
                    return response;
                },
                {
                    detail: {
                        summary: 'Me (Current User)',
                    },
                },
            )
    )
    // Handle better-auth requests
    .all("*", async (context: Context) => {
        const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"]
        // validate request method
        if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
            const response = await betterAuth.handler(context.request);

            if (!response.ok) {
                if (!response.headers.get('Content-Type')) {
                    response.headers.set('Content-Type', 'application/json');
                }
            }

            return response;
        }
        else {
            context.error(405)
            return;
        }
    })

export default app;
