import { APIError, getSessionFromCtx } from 'better-auth/api';
import { deleteSessionCookie, setSessionCookie } from 'better-auth/cookies';
import { createAuthEndpoint, createAuthMiddleware } from 'better-auth/plugins';
import type {
  AuthPluginSchema,
  BetterAuthPlugin,
  GenericEndpointContext,
  InferOptionSchema,
  Session,
  User,
} from 'better-auth/types';
import { z } from 'zod';

import { PERMISSIONS } from '../../../roles/constants';
import { isPermissionGrantedToUser } from '../../../roles/helpers';
import type { PermissionIdentifier } from '../../../roles/types';
import { getAdminAdapter } from './adapter';

const getDate = (span: number, unit: 'sec' | 'ms' = 'ms') => {
  return new Date(Date.now() + (unit === 'sec' ? span * 1000 : span));
};

const getEndpointResponse = async <T>(ctx: {
  context: {
    returned?: unknown;
  };
}) => {
  const returned = ctx.context.returned;
  if (!returned) {
    return null;
  }
  if (returned instanceof Response) {
    if (returned.status !== 200) {
      return null;
    }
    return (await returned.clone().json()) as T;
  }
  if (returned instanceof APIError) {
    return null;
  }
  return returned as T;
};

export function mergeSchema<S extends AuthPluginSchema>(
  schema: S,
  newSchema?: {
    [K in keyof S]?: {
      modelName?: string;
      fields?: {
        [P: string]: string;
      };
    };
  },
) {
  if (!newSchema) {
    return schema;
  }
  for (const table in newSchema) {
    const newModelName = newSchema[table]?.modelName;
    if (newModelName) {
      schema[table].modelName = newModelName;
    }
    for (const field in schema[table].fields) {
      const newField = newSchema[table]?.fields?.[field];
      if (!newField) {
        continue;
      }
      schema[table].fields[field].fieldName = newField;
    }
  }
  return schema;
}

export interface UserWithRole extends User {
  rolesSlugs: string[];
  isBanned?: boolean | null;
  banReason?: string | null;
  banExpiresAt?: Date | null;
  deletedAt?: Date | null;
}

export interface SessionWithImpersonatedBy extends Session {
  impersonatedById?: string;
}

interface AdminOptions {
  /**
   * The default role for a user created by the admin
   *
   * @default "user"
   */
  defaultRole?: string | false;
  /**
   * A default ban reason
   *
   * By default, no reason is provided
   */
  defaultBanReason?: string;
  /**
   * Number of seconds until the ban expires
   *
   * By default, the ban never expires
   */
  defaultBanExpiresIn?: number;
  /**
   * Duration of the impersonation session in seconds
   *
   * By default, the impersonation session lasts 1 hour
   */
  impersonationSessionDuration?: number;
  /**
   * Permissions for the admin plugin
   */
  permissions?: {
    banUser?: PermissionIdentifier;
    unbanUser?: PermissionIdentifier;
    impersonateUser?: PermissionIdentifier;
    stopImpersonating?: PermissionIdentifier;
    deleteUser?: PermissionIdentifier;
    listUsers?: PermissionIdentifier;
    setUserRole?: PermissionIdentifier;
    listUserSessions?: PermissionIdentifier;
    revokeUserSession?: PermissionIdentifier;
    revokeUserSessions?: PermissionIdentifier;
    linkUser?: PermissionIdentifier;
    unlinkUser?: PermissionIdentifier;
    [key: string]: PermissionIdentifier | undefined;
  };
  /**
   * Custom schema for the admin plugin
   */
  schema?: InferOptionSchema<typeof schema>;
}

export const admin = <O extends AdminOptions>(options?: O) => {
  const defaultPermissions = {
    banUser: PERMISSIONS.USERS.BAN.key,
    unbanUser: PERMISSIONS.USERS.UNBAN.key,
    impersonateUser: PERMISSIONS.USERS.IMPERSONATE.key,
    stopImpersonating: PERMISSIONS.USERS.IMPERSONATE.key,
    deleteUser: PERMISSIONS.USERS.DESTROY.key,
    listUsers: PERMISSIONS.USERS.SHOW.key,
    setUserRole: PERMISSIONS.USERS.UPDATE_ROLES.key,
    listUserSessions: PERMISSIONS.USERS.LIST_SESSIONS.key,
    revokeUserSession: PERMISSIONS.USERS.REVOKE_SESSIONS.key,
    revokeUserSessions: PERMISSIONS.USERS.REVOKE_SESSIONS.key,
    linkUser: PERMISSIONS.USERS.LINK_USER.key,
    unlinkUser: PERMISSIONS.USERS.UNLINK_USER.key,
  };

  const opts = {
    defaultRole: 'user',
    ...options,
    permissions: { ...defaultPermissions, ...options?.permissions },
  };

  const ERROR_CODES = {
    FAILED_TO_CREATE_USER: 'Failed to create user',
    USER_NOT_HAS_ROLE: 'User does not have role',
    YOU_CANNOT_BAN_YOURSELF: 'You cannot ban yourself',
    ROLE_NOT_FOUND: 'Role not found',
    USER_NOT_FOUND: 'User not found',
    UNAUTHORIZED: 'Unauthorized',
    PERMISSION_DENIED: 'Permission denied',
  } as const;

  const checkPermission = async (
    ctx: GenericEndpointContext,
    requiredPermission: PermissionIdentifier,
  ) => {
    const user = ctx.context.session?.user as UserWithRole;
    const hasPermission = await isPermissionGrantedToUser(user, requiredPermission);
    if (!hasPermission) {
      throw new APIError('FORBIDDEN', {
        message: ERROR_CODES.PERMISSION_DENIED,
      });
    }
  };

  const adminMiddleware = createAuthMiddleware(async (ctx) => {
    const session = await getSessionFromCtx(ctx);
    if (!session?.session) {
      throw new APIError('UNAUTHORIZED', {
        message: ERROR_CODES.UNAUTHORIZED,
      });
    }
    const user = session.user as UserWithRole;
    if (!user.rolesSlugs) {
      throw new APIError('FORBIDDEN', {
        message: ERROR_CODES.USER_NOT_HAS_ROLE,
      });
    }
    if (user.deletedAt) {
      throw new APIError('NOT_FOUND', {
        message: ERROR_CODES.USER_NOT_FOUND,
      });
    }
    return { session: { user, session: session.session } };
  });
  return {
    id: 'better-auth-admin',
    init(ctx) {
      return {
        options: {
          databaseHooks: {
            user: {
              create: {
                async before(user) {
                  if (options?.defaultRole === false) return;
                  const adapter = getAdminAdapter(ctx);
                  const defaultRole = await adapter.findRoleBySlug(options?.defaultRole ?? 'basic');
                  if (!defaultRole) {
                    throw new APIError('BAD_REQUEST', {
                      message: ERROR_CODES.ROLE_NOT_FOUND,
                    });
                  }
                  return {
                    data: {
                      rolesSlugs: [defaultRole.slug],
                      ...user,
                    },
                  };
                },
              },
            },
            session: {
              create: {
                async before(session) {
                  const user = (await ctx.internalAdapter.findUserById(
                    session.userId,
                  )) as UserWithRole;
                  if (user.isBanned) {
                    if (user.banExpiresAt && user.banExpiresAt.getTime() < Date.now()) {
                      await ctx.internalAdapter.updateUser(session.userId, {
                        isBanned: false,
                        banReason: null,
                        banExpiresAt: null,
                      });
                      return;
                    }
                    return false;
                  }
                  return;
                },
              },
            },
          },
        },
      };
    },
    hooks: {
      after: [
        {
          matcher(context) {
            return context.path === '/list-sessions';
          },
          handler: createAuthMiddleware(async (ctx) => {
            const response = await getEndpointResponse<SessionWithImpersonatedBy[]>(ctx);

            if (!response) {
              return;
            }
            const newJson = response.filter((session) => {
              return !session.impersonatedById;
            });

            return ctx.json(newJson);
          }),
        },
      ],
    },
    endpoints: {
      listUserSessions: createAuthEndpoint(
        '/admin/list-user-sessions',
        {
          method: 'POST',
          use: [adminMiddleware],
          body: z.object({
            userId: z.string({
              description: 'The user id',
            }),
          }),
          metadata: {
            openapi: {
              operationId: 'listUserSessions',
              summary: 'List user sessions',
              description: 'List user sessions',
              responses: {
                200: {
                  description: 'List of user sessions',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          sessions: {
                            type: 'array',
                            items: {
                              $ref: '#/components/schemas/Session',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        async (ctx) => {
          await checkPermission(ctx, opts.permissions.listUserSessions);
          const sessions = await ctx.context.internalAdapter.listSessions(ctx.body.userId);
          ctx.setHeader('Content-Type', 'application/json');
          return {
            sessions: sessions,
          };
        },
      ),
      unbanUser: createAuthEndpoint(
        '/admin/unban-user',
        {
          method: 'POST',
          body: z.object({
            userId: z.string({
              description: 'The user id',
            }),
          }),
          use: [adminMiddleware],
          metadata: {
            openapi: {
              operationId: 'unbanUser',
              summary: 'Unban a user',
              description: 'Unban a user',
              responses: {
                200: {
                  description: 'User unbanned',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          user: {
                            $ref: '#/components/schemas/User',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        async (ctx) => {
          await checkPermission(ctx, opts.permissions.unbanUser);
          const user = await ctx.context.internalAdapter.updateUser(ctx.body.userId, {
            isBanned: false,
          });
          ctx.setHeader('Content-Type', 'application/json');
          return ctx.json({
            user: user,
          });
        },
      ),
      banUser: createAuthEndpoint(
        '/admin/ban-user',
        {
          method: 'POST',
          body: z.object({
            userId: z.string({
              description: 'The user id',
            }),
            /**
             * Reason for the ban
             */
            banReason: z
              .string({
                description: 'The reason for the ban',
              })
              .optional(),
            /**
             * Number of seconds until the ban expires
             */
            banExpiresIn: z
              .number({
                description: 'The number of seconds until the ban expires',
              })
              .optional(),
          }),
          use: [adminMiddleware],
          metadata: {
            openapi: {
              operationId: 'banUser',
              summary: 'Ban a user',
              description: 'Ban a user',
              responses: {
                200: {
                  description: 'User banned',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          user: {
                            $ref: '#/components/schemas/User',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        async (ctx) => {
          await checkPermission(ctx, opts.permissions.banUser);
          if (ctx.body.userId === ctx.context.session.user.id) {
            throw new APIError('BAD_REQUEST', {
              message: ERROR_CODES.YOU_CANNOT_BAN_YOURSELF,
            });
          }
          const user = await ctx.context.internalAdapter.updateUser(ctx.body.userId, {
            isBanned: true,
            banReason: ctx.body.banReason || options?.defaultBanReason || 'No reason',
            banExpiresAt: ctx.body.banExpiresIn
              ? getDate(ctx.body.banExpiresIn, 'sec')
              : options?.defaultBanExpiresIn
                ? getDate(options.defaultBanExpiresIn, 'sec')
                : undefined,
          });
          //revoke all sessions
          await ctx.context.internalAdapter.deleteSessions(ctx.body.userId);
          ctx.setHeader('Content-Type', 'application/json');
          return ctx.json({
            user: user,
          });
        },
      ),
      impersonateUser: createAuthEndpoint(
        '/admin/impersonate-user',
        {
          method: 'POST',
          body: z.object({
            userId: z.string({
              description: 'The user id',
            }),
          }),
          use: [adminMiddleware],
          metadata: {
            openapi: {
              operationId: 'impersonateUser',
              summary: 'Impersonate a user',
              description: 'Impersonate a user',
              responses: {
                200: {
                  description: 'Impersonation session created',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          session: {
                            $ref: '#/components/schemas/Session',
                          },
                          user: {
                            $ref: '#/components/schemas/User',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        async (ctx) => {
          await checkPermission(ctx, opts.permissions.impersonateUser);
          const targetUser = await ctx.context.internalAdapter.findUserById(ctx.body.userId);

          if (!targetUser) {
            throw new APIError('NOT_FOUND', {
              message: 'User not found',
            });
          }

          const session = await ctx.context.internalAdapter.createSession(
            targetUser.id,
            // @ts-ignore
            undefined,
            true,
            {
              impersonatedById: ctx.context.session.user.id,
              expiresAt: options?.impersonationSessionDuration
                ? getDate(options.impersonationSessionDuration, 'sec')
                : getDate(60 * 60, 'sec'), // 1 hour
            },
          );
          if (!session) {
            throw new APIError('INTERNAL_SERVER_ERROR', {
              message: ERROR_CODES.FAILED_TO_CREATE_USER,
            });
          }
          const authCookies = ctx.context.authCookies;
          deleteSessionCookie(ctx);
          await ctx.setSignedCookie(
            'admin_session',
            ctx.context.session.session.token,
            ctx.context.secret,
            authCookies.sessionToken.options,
          );
          await setSessionCookie(
            ctx,
            {
              session: session,
              user: targetUser,
            },
            true,
          );
          ctx.setHeader('Content-Type', 'application/json');
          return ctx.json({
            session: session,
            user: targetUser,
          });
        },
      ),
      stopImpersonating: createAuthEndpoint(
        '/admin/stop-impersonating',
        {
          method: 'POST',
        },
        async (ctx) => {
          await checkPermission(ctx, opts.permissions.stopImpersonating);
          const session = await getSessionFromCtx<
            // biome-ignore lint/complexity/noBannedTypes: <explanation>
            // eslint-disable-next-line @typescript-eslint/no-empty-object-type
            {},
            {
              impersonatedById: string;
            }
          >(ctx);
          if (!session) {
            throw new APIError('UNAUTHORIZED', {
              message: ERROR_CODES.UNAUTHORIZED,
            });
          }
          if (!session.session.impersonatedById) {
            throw new APIError('BAD_REQUEST', {
              message: 'You are not impersonating anyone',
            });
          }
          const user = await ctx.context.internalAdapter.findUserById(
            session.session.impersonatedById,
          );
          if (!user) {
            throw new APIError('INTERNAL_SERVER_ERROR', {
              message: 'Failed to find user',
            });
          }
          const adminCookie = await ctx.getSignedCookie('admin_session', ctx.context.secret);
          if (!adminCookie) {
            throw new APIError('INTERNAL_SERVER_ERROR', {
              message: 'Failed to find admin session',
            });
          }
          const adminSession = await ctx.context.internalAdapter.findSession(adminCookie);
          if (!adminSession || adminSession.session.userId !== user.id) {
            throw new APIError('INTERNAL_SERVER_ERROR', {
              message: 'Failed to find admin session',
            });
          }
          await setSessionCookie(ctx, adminSession);
          ctx.setHeader('Content-Type', 'application/json');
          return ctx.json(adminSession);
        },
      ),
      revokeUserSession: createAuthEndpoint(
        '/admin/revoke-user-session',
        {
          method: 'POST',
          body: z.object({
            sessionToken: z.string({
              description: 'The session token',
            }),
          }),
          use: [adminMiddleware],
          metadata: {
            openapi: {
              operationId: 'revokeUserSession',
              summary: 'Revoke a user session',
              description: 'Revoke a user session',
              responses: {
                200: {
                  description: 'Session revoked',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          success: {
                            type: 'boolean',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        async (ctx) => {
          await checkPermission(ctx, opts.permissions.revokeUserSession);
          await ctx.context.internalAdapter.deleteSession(ctx.body.sessionToken);
          ctx.setHeader('Content-Type', 'application/json');
          return ctx.json({
            success: true,
          });
        },
      ),
      revokeUserSessions: createAuthEndpoint(
        '/admin/revoke-user-sessions',
        {
          method: 'POST',
          body: z.object({
            userId: z.string({
              description: 'The user id',
            }),
          }),
          use: [adminMiddleware],
          metadata: {
            openapi: {
              operationId: 'revokeUserSessions',
              summary: 'Revoke all user sessions',
              description: 'Revoke all user sessions',
              responses: {
                200: {
                  description: 'Sessions revoked',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          success: {
                            type: 'boolean',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        async (ctx) => {
          await checkPermission(ctx, opts.permissions.revokeUserSessions);
          await ctx.context.internalAdapter.deleteSessions(ctx.body.userId);
          ctx.setHeader('Content-Type', 'application/json');
          return ctx.json({
            success: true,
          });
        },
      ),
      removeUser: createAuthEndpoint(
        '/admin/remove-user',
        {
          method: 'POST',
          body: z.object({
            userId: z.string({
              description: 'The user id',
            }),
          }),
          use: [adminMiddleware],
          metadata: {
            openapi: {
              operationId: 'removeUser',
              summary: 'Remove a user',
              description: 'Delete a user and all their sessions and accounts. Cannot be undone.',
              responses: {
                200: {
                  description: 'User removed',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          success: {
                            type: 'boolean',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        async (ctx) => {
          await checkPermission(ctx, opts.permissions.deleteUser);
          await ctx.context.internalAdapter.deleteUser(ctx.body.userId);
          ctx.setHeader('Content-Type', 'application/json');
          return ctx.json({
            success: true,
          });
        },
      ),
    },
    $ERROR_CODES: ERROR_CODES,
    schema: mergeSchema(schema, opts.schema),
  } satisfies BetterAuthPlugin;
};

const schema = {
  user: {
    fields: {
      isBanned: {
        type: 'boolean',
        defaultValue: false,
        required: false,
        input: false,
      },
      banReason: {
        type: 'string',
        required: false,
        input: false,
      },
      banExpiresAt: {
        type: 'date',
        required: false,
        input: false,
      },
    },
  },
  session: {
    fields: {
      impersonatedById: {
        type: 'string',
        required: false,
      },
    },
  },
} satisfies AuthPluginSchema;
