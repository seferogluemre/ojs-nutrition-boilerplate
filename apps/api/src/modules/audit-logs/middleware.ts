import { AuditLogService } from "./service";
import { dtoWithMiddlewares, ExtractBody, Middleware, ControllerHook, HttpError } from "../../utils";
import { AuthContext } from "../auth";
import { AuditLogEntityType } from "./types";
import { AuditLogAction } from "./constants";

type AuditLogContext<Hook extends ControllerHook> = AuthContext & { body: ExtractBody<Hook> };

interface AuditLogOptions<Hook extends ControllerHook, Context extends AuditLogContext<Hook> = AuditLogContext<Hook>> {
    actionType: AuditLogAction;
    entityType: AuditLogEntityType;
    getEntityUuid: (ctx: Context) => string;
    getDescription?: (ctx: Context) => string;
    getMetadata?: (ctx: Context) => Record<string, any>;
}

export function withAuditLog<Hook extends ControllerHook, Context extends AuditLogContext<Hook> = AuditLogContext<Hook>>(
    options: AuditLogOptions<Hook, Context>
): Middleware<Context> {
    return {
        afterHandle: async (ctx) => {
            const { request, user } = ctx as Context;
            if (!user?.id) return;

            if (ctx.response instanceof HttpError) {
                return;
            }

            try {
                await AuditLogService.create({
                    userId: user.id,
                    actionType: options.actionType,
                    entityType: options.entityType,
                    entityUuid: options.getEntityUuid(ctx),
                    description: options.getDescription?.(ctx),
                    metadata: options.getMetadata?.(ctx),
                    ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
                    userAgent: request.headers.get("user-agent") || undefined,
                });
            } catch (error) {
                console.error("Failed to create audit log:", error);
            }
        }
    };
}

export function dtoWithLogging<Hook extends ControllerHook>(
    hook: Hook,
    options: AuditLogOptions<Hook>
): Hook {
    return dtoWithMiddlewares(hook, withAuditLog<Hook>(options));
}
