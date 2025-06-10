import { User } from '#prisma/client';
import {Context} from 'elysia';

export interface AuthContext extends Context {
    user: User;
}
