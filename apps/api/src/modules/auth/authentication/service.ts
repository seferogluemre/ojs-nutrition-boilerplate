export abstract class AuthenticationService {
    static async hashPassword(password: string | undefined): Promise<string | undefined> {
        if (!password) return undefined;

        return Bun.password.hash(password, {
            algorithm: 'argon2id',
            memoryCost: 19456,
            timeCost: 2,
        });
    }

    static async verifyPassword(password: string, hash: string): Promise<boolean> {
        return Bun.password.verify(password, hash);
    }
}
