interface MailerConfig {
    transport: {
        host: string | undefined;
        port: number;
        secure: boolean;
        auth: {
            user: string | undefined;
            pass: string | undefined;
        };
        tls: {
            rejectUnauthorized: boolean;
        };
    };
    defaults: {
        from: string;
    };
    preview: boolean;
    from: string;
}

export const emailConfig: { 
    mailer: MailerConfig; 
    redis: { 
        host: string; 
        port: number; 
        password?: string; 
    };
    app: { url: string };
} = {
    mailer: {
        transport: {
            host: process.env.SMTP_HOST,
            port: +(process.env.SMTP_PORT ?? 587),
            secure: JSON.parse(process.env.SMTP_SECURE ?? 'false'),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        },
        defaults: {
            from: `${process.env.SMTP_FROM_NAME || 'OnlyJS Nutrition'} <${process.env.SMTP_FROM || 'noreply@djsnutrition.com'}>`,
        },
        preview: JSON.parse(process.env.MAILER_PREVIEW ?? 'false'),
        from: `${process.env.SMTP_FROM_NAME || 'OnlyJS Nutrition'} <${process.env.SMTP_FROM || 'noreply@djsnutrition.com'}>`,
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
    },
    app: {
        url: process.env.APP_URL || 'http://localhost:5173',
    },
};