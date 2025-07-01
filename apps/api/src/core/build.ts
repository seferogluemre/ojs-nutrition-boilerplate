import dts from 'bun-plugin-dts';
import { loadEnv } from '../config/env';

loadEnv();

await Bun.build({
    entrypoints: ["src/index.ts"],
    outdir: "../../dist/apps/api",
    target: "bun",
    plugins: [
        dts()
    ],
    minify: true,
    sourcemap: "linked",
});

console.info("Build completed");
