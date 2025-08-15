import { env } from "#config/env.ts";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.apiUrl,
  basePath: "/auth",
}) as ReturnType<typeof createAuthClient>;