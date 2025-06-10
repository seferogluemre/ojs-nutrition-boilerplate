import { config } from '@dotenvx/dotenvx';

// Package.json'daki envFile config'i (apps/api working directory'sinden relative)
// NPM script'ler zaten apps/api klasöründen çalıştığı için bu path direkt kullanılabilir
const envFilePath = process.env.npm_package_config_envFile || '../../config/apps/api/.env';

export const loadEnv = () => {
  config({
    path: envFilePath,
    quiet: true
  });
};

export { envFilePath }; 