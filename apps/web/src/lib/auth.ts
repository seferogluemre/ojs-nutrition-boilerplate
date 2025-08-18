import { env } from "#/config/env"
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.apiUrl+"/auth",
}) as ReturnType<typeof createAuthClient>;