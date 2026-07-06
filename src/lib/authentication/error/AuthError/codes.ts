export type AuthErrorCode = "user_roles_does_not_exist";

export type AuthErrorResponse = {
  code: AuthErrorCode;
  description?: string;
  status: number;
};
