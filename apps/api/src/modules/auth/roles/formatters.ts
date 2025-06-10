import { Role } from '#prisma/client';
import { BaseFormatter } from '../../../utils';
import { RolePlain } from '#prismabox/barrel';

export abstract class RoleFormatter {
    static response(data: Role) {
        const convertedData = BaseFormatter.convertData<typeof RolePlain.static>(
            data,
            RolePlain,
        );
        return convertedData;
    }
}