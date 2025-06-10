import type { admin } from "./index";
import type { BetterAuthClientPlugin } from "better-auth/types";

export const adminClient = () => {
  return {
    id: "better-auth-admin-client",
    $InferServerPlugin: {} as ReturnType<typeof admin>,
    pathMethods: {
      "/admin/stop-impersonating": "POST",
    },
  } satisfies BetterAuthClientPlugin;
};
