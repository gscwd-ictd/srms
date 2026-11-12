import { RoleAbility } from "../../types";

export interface I_AuthService {
  getUserRoles(): Promise<RoleAbility | Error | null>;
}
