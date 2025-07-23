import { Elysia } from 'elysia';

import { PERMISSIONS, dtoWithPermission } from '../auth';
import { auth } from '../auth/authentication/plugin';
import { auditLogsCron } from './cron';
import { findAuditLogsDto } from './dtos';
import { AuditLogService } from './service';

const app = new Elysia({
  prefix: '/audit-logs',
})
  .use(auditLogsCron)
  .use(auth())
  .get(
    '',
    async ({ query }) => {
      const {
        userId,
        name,
        actionType,
        entityType,
        entityUuid,
        startDate,
        endDate,
        page,
        perPage,
        orderBy,
      } = query;

      const result = await AuditLogService.find({
        userId: userId,
        name,
        actionType,
        entityType,
        entityUuid,
        startDate,
        endDate,
        page,
        perPage,
        orderBy,
      });

      return result;
    },
    dtoWithPermission(findAuditLogsDto, PERMISSIONS.SYSTEM_ADMINISTRATION.SHOW_LOGS),
  );

export default app;
