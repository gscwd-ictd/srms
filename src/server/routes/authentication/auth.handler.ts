import { AppRouteHandler } from "@srms/server/types";
import { GetUserRolesRoute } from "./auth.routes";
import { authManager } from "@srms/server/app";
import { RoleAbility } from "@srms/lib/authentication/types";

export const getUserRoles: AppRouteHandler<GetUserRolesRoute> = async (c) => {
  const userRoles = (await authManager.getAuthService().getUserRoles()) as RoleAbility;

  return c.json(userRoles, 200);
};
