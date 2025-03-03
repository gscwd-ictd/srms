import * as client from "openid-client";
import { OIDCClientOptions } from "../types/oidc";

export class OIDCClient {
  private oidcConfig: client.Configuration | null = null;
  private _codeVerifier: string | null = null;
  private _nonce: string | null = null;
  private _state: string | null = null;

  constructor(private readonly options: OIDCClientOptions) {}

  public async initialize() {
    const discoverUrl = new URL(`${this.options.authorizationServerUrl}/.well-known/openid-configuration`);

    this.oidcConfig = await client.discovery(
      discoverUrl,
      this.options.clientId,
      this.options.clientSecret,
      undefined,
      {
        execute: this.options.allowInsecure ? [client.allowInsecureRequests] : undefined,
      },
    );
  }

  public async createAuthorizationURL() {
    if (!this.oidcConfig) {
      throw new Error("OIDCClient not initialized. Call initialize() first.");
    }

    this._codeVerifier = client.randomPKCECodeVerifier();
    const codeChallenge = await client.calculatePKCECodeChallenge(this._codeVerifier);
    this._state = client.randomState();

    const parameters: Record<string, string> = {
      redirect_uri: this.options.redirectUri,
      scope: this.options.scope || "openid",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      state: this._state,
    };

    // Add nonce if PKCE is not supported
    if (!this.oidcConfig.serverMetadata().supportsPKCE()) {
      this._nonce = client.randomNonce();
      parameters.nonce = this._nonce;
    }

    const url = client.buildAuthorizationUrl(this.oidcConfig, parameters);

    return {
      url,
      codeVerifier: this._codeVerifier,
      state: this._state,
      nonce: this._nonce || undefined,
    };
  }
}
