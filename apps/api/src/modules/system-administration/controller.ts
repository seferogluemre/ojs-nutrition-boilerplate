import { Elysia } from 'elysia';
import { auditLogsController } from '../audit-logs';
import { UserFormatter } from '../users';
import {
    initialUserSetupDto,
} from './dto';
import { SystemAdministrationService } from './service';

const app: any = new Elysia({
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
    )
    .get(
        '/debug/users',
        async () => {
            const users = await SystemAdministrationService.debugUsers();
            return { users };
        },
        {
            detail: {
                summary: 'Debug Users',
                description: 'Shows all users for debugging purposes',
            },
        },
    )
    .get(
        '/test',
        async () => {
            return { message: 'System Administration Controller is working!' };
        },
        {
            detail: {
                summary: 'Test Endpoint',
                description: 'Simple test endpoint',
            },
        },
    );

export default app;
