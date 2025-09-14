# OJS Nutrition – Monorepo

A modern e-commerce monorepo consisting of API and Web applications. Built for performance, scalability and great DX.

## Table of Contents
- [OJS Nutrition – Monorepo](#ojs-nutrition--monorepo)
  - [Table of Contents](#table-of-contents)
  - [Screenshots](#screenshots)
  - [Architecture](#architecture)
  - [Quick Start](#quick-start)
  - [Development Commands](#development-commands)
    - [Handy API Commands](#handy-api-commands)
  - [Environment Variables](#environment-variables)
    - [apps/api/.env](#appsapienv)
    - [apps/web/.env](#appswebenv)
  - [API (apps/api)](#api-appsapi)
  - [Web (apps/web)](#web-appsweb)
  - [Packages](#packages)
  - [Code Quality](#code-quality)
  - [Deployment](#deployment)
  - [Contributing](#contributing)
  - [License](#license)

## Screenshots

> A few visuals from the current build

![Home](apps/web/public/images/banner.png)

![All Products](apps/web/public/images/tüm_ürünler.png)

![Admin UI Components](apps/web/public/images/shadcn-admin.png)

## Architecture

Turborepo is used as the monorepo orchestrator.

Structure (short):

```
apps/
  api/        # Elysia + Prisma REST API
  web/        # React + Vite + TanStack Router SPA
packages/
  eden/       # API client / shared types (eden)
  schemas/    # Shared schemas/types
  tooling-config/ # Shared ESLint, Prettier, TS configs
```

Key technologies:
- TypeScript, ESM
- Elysia (Bun) + Prisma + PostgreSQL
- React 18, TanStack Router, TailwindCSS, shadcn/ui
- React Query, Zustand
- Turborepo task cache and parallelization

## Quick Start

Prerequisites:
- Node.js 20+ and/or Bun 1.1+
- pnpm 9+
- PostgreSQL (local or Docker)

Install:

```bash
pnpm install
```

Database (example):

```bash
cd apps/api
# create .env (see samples below)
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed   # varsa seed
```

Run in development (from repo root):

```bash
pnpm dev
```

This runs API and Web in parallel.

## Development Commands

From root `package.json`:

```bash
pnpm dev            # run apps/api and apps/web together
pnpm build          # build all packages
pnpm lint           # eslint across packages
pnpm format         # prettier format
```

### Handy API Commands
```bash
cd apps/api
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:studio
```

## Environment Variables

### apps/api/.env
```
DATABASE_URL=postgres://user:pass@localhost:5432/ojs
JWT_SECRET=change_me
APP_URL=http://localhost:3000
SMTP_HOST=...
SMTP_USER=...
SMTP_PASS=...
```

### apps/web/.env
```
VITE_API_URL=http://localhost:3000
```

## API (apps/api)
- Stack: Elysia (Bun) + Prisma
- Modules: auth, users, products, orders, cart, categories, file-library, locations, etc.
- Swagger/OpenAPI: `src/config/swagger.config.ts`
- Email templates: `src/emails/`
- Data model: `prisma/schema.prisma`, migrations under `prisma/migrations/`

Run:
```bash
cd apps/api
pnpm dev
```

## Web (apps/web)
- React + Vite + TanStack Router
- Tailwind + shadcn/ui components
- Global state: Zustand; data layer: React Query
- Theme: Light/Dark toggle (no system option)

Run:
```bash
cd apps/web
pnpm dev
```

Build:
```bash
pnpm build
pnpm preview
```

## Packages
- `packages/tooling-config`: Shared ESLint/Prettier/TS configs
- `packages/schemas`: Shared schemas/types
- `packages/eden`: API client/SDK

## Code Quality
- ESLint, Prettier, TypeScript strict
- Consistent import aliases (`#components`, `#features`, `#lib` ...)
- Recommended to run lint/build in PR and CI

## Deployment
- API: runs on Bun or Node; PostgreSQL as database
- Web: Vite build can be deployed to Netlify/Vercel/Nginx
- Ensure production env vars are set

## Contributing
1. Create a feature branch (`feat/` or `fix/` prefix)
2. Write meaningful commits (Conventional Commits recommended)
3. Open a PR; ensure lint and build pass

## License
This project is open-source for developers to learn and build on top of it. Unless otherwise stated in package-level licenses, it is provided under a project-specific permissive license. Contributions are welcome.
 