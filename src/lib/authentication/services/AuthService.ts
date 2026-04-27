import { cookies } from "next/headers";
import { UserRolesDoesNotExistError } from "../error/AuthError/UserRolesDoesNotExistError";
import { I_AuthService } from "../interfaces";
import { RoleAbility } from "../types";
import { verifyAccessToken } from "@srms/components/functions/verifyAccessToken";
import { isEmpty } from "@srms/utils/isEmpty";

export class AuthService implements I_AuthService {
  async getUserRoles(): Promise<RoleAbility | Error | null> {
    const token = (await cookies()).get("accessToken")?.value;

    const roles = token ? await verifyAccessToken(token) : null;

    if (!isEmpty(roles)) {
      return roles;
    } else {
      throw new UserRolesDoesNotExistError(`${roles}`);
    }
  }
}
