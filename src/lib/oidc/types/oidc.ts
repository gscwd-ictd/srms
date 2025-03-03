export type OIDCClientOptions = {
  authorizationServerUrl: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope?: string;
  allowInsecure?: boolean;
};
