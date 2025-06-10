import { createClient, RedisClientType } from "redis";
import { Primitive } from "type-fest";

class NotConnectedError extends Error {
    constructor() {
        super('Redis client is not connected');
    }
}

class Cache {
    private client?: RedisClientType;
    private isConnected = false;
    private prefix = '';

    constructor() {
        if (!process.env.REDIS_URL) {
            console.warn('REDIS_URL is not set, cache will not be used');
            return;
        }

        this.prefix = process.env.APP_SLUG ? `${process.env.APP_SLUG}:` : '';

        this.client = createClient({
            url: process.env.REDIS_URL
        });

        this.client.on('error', (err: Error) => console.error('Redis Client Error', err));
        this.client.on('connect', () => {
            console.info('Redis Client Connected');
            this.isConnected = true;
        });
        this.client.on('end', () => {
            console.info('Redis Client Disconnected');
            this.isConnected = false;
        });

        this.connect();
    }

    private async connect() {
        if (!this.isConnected) {
            await this.client?.connect();
        }
    }

    private checkConnection() {
        if (!this.client || !this.isConnected) {
            throw new NotConnectedError();
        }
    }

    private getKeyWithPrefix(key: string): string {
        return `${this.prefix}${key}`;
    }

    async getPrimitive<T extends string>(key: T): Promise<Primitive> {
        const value = (await this.get<Primitive>(key));
        return value;
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            this.checkConnection();
            const value = await this.client?.get(this.getKeyWithPrefix(key));
            return value ? JSON.parse(value) : null;
        } catch (error) {
            if (!(error instanceof NotConnectedError)) {
                console.error('Cache get error:', error);
            }
            return null;
        }
    }

    async set(key: string, value: unknown, ttl?: number) {
        try {
            this.checkConnection();
            const stringValue = JSON.stringify(value);
            const prefixedKey = this.getKeyWithPrefix(key);
            if (ttl) {
                await this.client!.setEx(prefixedKey, ttl, stringValue);
            } else {
                await this.client!.set(prefixedKey, stringValue);
            }
        } catch (error) {
            if (!(error instanceof NotConnectedError)) {
                console.error('Cache set error:', error);
            }
        }
    }

    async del(keys: string | string[]) {
        try {
            this.checkConnection();
            if (Array.isArray(keys)) {
                const prefixedKeys = keys.map(key => this.getKeyWithPrefix(key));
                await this.client!.del(prefixedKeys);
            } else {
                await this.client!.del(this.getKeyWithPrefix(keys));
            }
        } catch (error) {
            if (!(error instanceof NotConnectedError)) {
                console.error('Cache del error:', error);
            }
        }
    }

    async keys(pattern: string) {
        try {
            this.checkConnection();
            return await this.client!.keys(this.getKeyWithPrefix(pattern));
        } catch (error) {
            if (!(error instanceof NotConnectedError)) {
                console.error('Cache keys error:', error);
            }
            return [];
        }
    }
}

export const cache = new Cache();
