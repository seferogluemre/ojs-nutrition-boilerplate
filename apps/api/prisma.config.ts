import type { PrismaConfig } from 'prisma';
import { loadEnv } from './src/config/env';

loadEnv();

export default {
    earlyAccess: true,
} satisfies PrismaConfig