import { t } from 'elysia';

const uuid = t.String({
    format: 'uuid',
});

const ip = t.String({
    pattern: '^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    error: 'Geçersiz IP adresi formatı',
});

export { uuid as uuidValidation, ip as ipValidation };
