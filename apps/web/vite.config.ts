import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import autoprefixer from "autoprefixer";
import path from "path";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  envDir: path.resolve(__dirname, '../../config/apps/web'),
  optimizeDeps: {
    exclude: ['@onlyjs/api', '#prisma/client', '@prisma/client',],
  },
  root: __dirname,
  plugins: [react(), TanStackRouterVite()],
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          config: path.join(__dirname, "tailwind.config.js"),
        }),
        autoprefixer(),
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      '#prismabox': path.resolve(__dirname, '../api/prisma/prismabox'),
      // fix loading all icon chunks in dev mode
      // https://github.com/tabler/tabler-icons/issues/1233
      "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
      ".prisma/client/index-browser": path.resolve(
        __dirname,
        "../../node_modules/.prisma/client/index-browser.js",
      ),
    },
  },
  build: {
    outDir: '../../dist/apps/web',
    emptyOutDir: true,
  },
  define: {
    __banner_node_url: {
      fileURLToPath: () => null,
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
