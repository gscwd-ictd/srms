import { AuthError } from "./AuthError";

export class UserRolesDoesNotExistError extends AuthError {
  constructor(description: string) {
    super("user_roles_does_not_exist", description, 400);
    this.name = this.constructor.name;
  }
}
