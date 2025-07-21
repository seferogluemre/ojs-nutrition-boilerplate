import { User } from '#prisma/client';
import { DocumentDecoration, Elysia, t } from 'elysia';
import { UnauthorizedException } from '../../../utils';
import { ensureUserHasPermission } from '../roles/helpers';
import { PermissionIdentifier } from '../roles/types';
import { betterAuth } from './instance';


export const auth = (requiredPermission?: PermissionIdentifier | null) => new Elysia()
    .resolve(async ({ request }) => {
        const session = await betterAuth.api.getSession({
            // @ts-ignore
            headers: request.headers,
        });

        if (!session) {
            throw new UnauthorizedException();
        }

        const user = session.user as unknown as Exclude<typeof session.user, 'rolesSlugs'> & Pick<User, 'rolesSlugs'>;

        ensureUserHasPermission(user, requiredPermission);

        return {
            user,
            session: session.session,
        };
    })
    .as("plugin");

export const authSwagger = {
    detail: {
        security: [
            {
                cookie: [],
            },
        ],
    },
    // This is usually not required because auth plugin is already
    // throwing unauthorized exception when cookie is not found
    /* cookie: t.Cookie({
        [process.env.APP_SLUG + '.session_token']: t.String(),
    }), */
} satisfies {
    detail: DocumentDecoration;
    cookie?: ReturnType<typeof t.Cookie>;
};
