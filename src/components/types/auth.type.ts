export type LogIn = {
  email: string;
  password: string;
  forgotPassword?: string;
  appSecret: string;
};

export type RefreshTokenBody = {
  accessToken: string;
  refreshToken: string;
};
