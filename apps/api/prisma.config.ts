import { loadEnv } from './src/config/env'
import type { PrismaConfig } from 'prisma'

loadEnv();

export default {
    earlyAccess: true,
} satisfies PrismaConfig
