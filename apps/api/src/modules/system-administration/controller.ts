import { Elysia } from 'elysia';
import { SystemAdministrationService } from './service';
import {
    initialUserSetupDto,
} from './dto';
import { auditLogsController } from '../audit-logs';
import { UserFormatter } from '../users';

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
