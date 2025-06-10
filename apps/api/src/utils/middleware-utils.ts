import type { Context } from "elysia";
import type { AuthContext } from "../modules/auth";
import type { ControllerHook } from "./elysia-types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BeforeHook<TContext = Context> = (context: TContext) => any | Promise<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AfterHook<TContext = Context> = (context: TContext & { response: any }) => any | Promise<any>;

export interface Middleware<TContext = Context> {
    beforeHandle?: BeforeHook<TContext> | BeforeHook<TContext>[];
    afterHandle?: AfterHook<TContext> | AfterHook<TContext>[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

type CombinedMiddleware<Hook, TContext = Context> = Hook & Middleware<TContext>;

function combineMiddlewares<Hook extends ControllerHook, TContext = Context>(
    hook: Hook,
    ...middlewares: Middleware<TContext>[]
): Hook {
    const result = Object.assign({}, hook) as CombinedMiddleware<Hook, TContext>;

    for (const middleware of middlewares) {
        // Combine beforeHandle hooks
        const beforeHandles = [];
        if (result.beforeHandle) {
            beforeHandles.push(...(Array.isArray(result.beforeHandle) ? result.beforeHandle : [result.beforeHandle]));
        }
        if (middleware.beforeHandle) {
            beforeHandles.push(...(Array.isArray(middleware.beforeHandle) ? middleware.beforeHandle : [middleware.beforeHandle]));
        }
        // @ts-ignore
        result.beforeHandle = beforeHandles.length === 1 ? beforeHandles[0] : beforeHandles.length > 1 ? beforeHandles : undefined;

        // Combine afterHandle hooks
        const afterHandles = [];
        if (result.afterHandle) {
            afterHandles.push(...(Array.isArray(result.afterHandle) ? result.afterHandle : [result.afterHandle]));
        }
        if (middleware.afterHandle) {
            afterHandles.push(...(Array.isArray(middleware.afterHandle) ? middleware.afterHandle : [middleware.afterHandle]));
        }
        // @ts-ignore
        result.afterHandle = afterHandles.length === 1 ? afterHandles[0] : afterHandles.length > 1 ? afterHandles : undefined;

        // Combine other properties
        Object.assign(result, middleware);
    }

    return result as Hook;
}

export function dtoWithMiddlewares<Hook extends ControllerHook, TContext = AuthContext>(
    hook: Hook,
    ...middlewares: Middleware<TContext>[]
): Hook {
    return combineMiddlewares<Hook, TContext>(hook, ...middlewares);
}
