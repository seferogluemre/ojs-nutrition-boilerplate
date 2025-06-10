import { Role, User } from "#prisma/client";
import { PermissionIdentifier, PermissionKey } from "./types";
import { ForbiddenException } from "../../../utils";
import { cache, prisma } from "#core";

const ROLE_CACHE_KEY = (slug: string) => `role:${slug}`;

export function isPermissionGrantedToRole(role: Role, permission: PermissionIdentifier) {
    const permissions = role.permissions as PermissionKey[];
    const permissionKey = typeof permission === 'string' ? permission : permission.key;
    return permissions.includes('*') || permissions.includes(permissionKey);
}

export async function isPermissionGrantedToUser(user: Pick<User, 'rolesSlugs'>, permission: PermissionIdentifier) {
    for (const slug of user.rolesSlugs) {
        const cachedRole = await cache.get<Role>(ROLE_CACHE_KEY(slug));
        if (cachedRole && isPermissionGrantedToRole(cachedRole, permission)) {
            return true;
        }

        const role = await prisma.role.findUnique({
            where: { slug }
        });

        if (role) {
            await cache.set(ROLE_CACHE_KEY(slug), role, 3600); // 1 saat cache
            if (isPermissionGrantedToRole(role, permission)) {
                return true;
            }
        }
    }
    return false;
}

export function ensureRoleHasPermission(role: Role, permission?: PermissionIdentifier | null) {
    if (!permission) return;
    if (!isPermissionGrantedToRole(role, permission)) {
        throw new ForbiddenException('Bu işlem için yetkiniz yok');
    }
}

export async function ensureUserHasPermission(user: Pick<User, 'rolesSlugs'>, permission?: PermissionIdentifier | null) {
    if (!permission) return;

    const userHasPermission = await isPermissionGrantedToUser(user, permission);

    if (!userHasPermission) {
        throw new ForbiddenException('Bu işlem için yetkiniz yok');
    }
}
