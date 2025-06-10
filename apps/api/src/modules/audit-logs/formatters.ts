import { BaseFormatter } from "../../utils/base-formatter";
import { User } from "#prisma/client";
import { AuditLog } from "#prisma/client";
import { AuditLogPlain } from "#prismabox/AuditLog";

export class AuditLogFormatter extends BaseFormatter {
    static formatWithUser(item: AuditLog & { user: Pick<User, 'id' | 'name'> }) {
        const baseData = BaseFormatter.convertData<typeof AuditLogPlain.static>(item, AuditLogPlain);

        return {
            ...baseData,
            user: {
                id: item.user.id,
                name: item.user.name,
            },
        };
    }
}
