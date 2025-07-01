import { cache, prisma } from "#core";
import { Gender } from "#prismabox/Gender";
import { betterAuth as betterAuthBase } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";
import { admin } from "./plugins/admin";
import { AuthenticationService } from "./service";

export const betterAuth = betterAuthBase({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    //
    appName: process.env.APP_NAME,
    basePath: "/auth",
    baseURL: process.env.APP_URL ?? "http://localhost:3000",
    secret: process.env.BETTER_AUTH_SECRET,
    url: process.env.APP_URL,
    trustedOrigins: [process.env.APP_URL!, process.env.API_URL!],
    domain: process.env.APP_DOMAIN,
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        maxPasswordLength: 32,
        password: {
            hash: async (password) => {
                return (await AuthenticationService.hashPassword(password))!;
            },
            verify: async ({ hash, password }) => {
                return AuthenticationService.verifyPassword(password, hash);
            },
        },
        autoSignIn: true,
    },
    user: {
        additionalFields: {
            firstName: {
                type: "string",
                required: true,
                fieldName: "firstName",
            },
            lastName: {
                type: "string",
                required: true,
                fieldName: "lastName",
            },
            gender: {
                type: "string",
                required: true,
                fieldName: "gender",
                defaultValue: Gender.MALE,
                input: false
            },
            rolesSlugs: {
                type: "string",
                required: true,
                fieldName: "rolesSlugs",
                defaultValue: [],
                input: false
            },
            isActive: {
                type: "boolean",
                required: true,
                fieldName: "isActive",
                defaultValue: true,
                input: false
            },
            deletedAt: {
                type: "date",
                required: false,
                fieldName: "deletedAt",
                input: false
            },
        },
    },
    account: {
        accountLinking: {
            enabled: true,
            allowDifferentEmails: true,
        },
    },
    advanced: {
        database: {
            generateId: false,
        },
        crossSubDomainCookies: {
            enabled: true,
            domain: process.env.APP_DOMAIN,
        },
        cookiePrefix: process.env.APP_SLUG,
    },
    secondaryStorage: process.env.REDIS_URL ? {
        get: async (key) => {
            const value = await cache.getPrimitive<string>(key) as string | null;
            return value ? value : null;
        },
        set: async (key, value, ttl) => {
            if (ttl) await cache.set(key, value, ttl);
            else await cache.set(key, value);
        },
        delete: async (key) => {
            await cache.del(key);
        }
    } : undefined,
    plugins: [
        admin(),
        openAPI({
            path: '/swagger',
            disableDefaultReference: true,
        }),
    ],
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    // @ts-ignore
                    const { firstName, lastName } = user;

                    return {
                        data: {
                            ...user,
                            name: `${firstName} ${lastName}`,
                        },
                    };
                },
            },
        },
    }
})
