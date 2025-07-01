import { Elysia } from 'elysia';
import { auditLogsController } from '../audit-logs';
import { UserFormatter } from '../users';
import {
    initialUserSetupDto,
} from './dto';
import { SystemAdministrationService } from './service';

const app = new Elysia({
    prefix: '/system-administration',
    detail: {
        tags: ['System Administration'],
    },
})
    .use(auditLogsController)
    .post(
        '/initial-user',
        async () => {
            const payload = await SystemAdministrationService.setupInitialUser();
            return { user: UserFormatter.response(payload.user) };
        },
        initialUserSetupDto,
    );

export default app;
