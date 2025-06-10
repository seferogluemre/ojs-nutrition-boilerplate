import type { AuthContext } from "better-auth/types";
import { RolesService } from "../../../roles/service";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getAdminAdapter = (context: AuthContext) => {
  return {
    findRoleBySlug: async (slug: string) => {
      const role = await RolesService.show({ slug });
      return role;
    },
  };
};
