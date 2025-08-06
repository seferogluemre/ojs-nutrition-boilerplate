import { ControllerHook, dtoWithMiddlewares, UnauthorizedException } from "../../../utils";
import { AuthContext } from "../authentication/types";
import { isPermissionGrantedToUser } from "./helpers";
import { PermissionIdentifier } from "./types";

export function withPermission(permission?: PermissionIdentifier) {
    return {
        beforeHandle: async ({ user, set }: AuthContext) => {
            if (!permission) return;
            const userHasPermission = await isPermissionGrantedToUser(user, permission);
            if (!userHasPermission) {
                const exception = new UnauthorizedException('Bu işlem için yetkiniz yok');
                set.status = exception.statusCode;
                set.headers = {
                    'Content-Type': 'application/json',
                };

                return exception;
            }

            return;
        }
    };
}

export function dtoWithPermission<T extends ControllerHook>(
    hook: T,
    permission?: PermissionIdentifier
): T {
    return dtoWithMiddlewares(hook, withPermission(permission)) as T;
}
