import { OIDCClientOptions } from "../types/oidc";
import { OIDCClient } from "./OIDCClient";

export class OIDCClientProvider {
  private static instance: OIDCClient | null = null;

  private constructor() {}

  public static async getInstance(options: OIDCClientOptions): Promise<OIDCClient> {
    if (!OIDCClientProvider.instance) {
      OIDCClientProvider.instance = new OIDCClient(options);
      await OIDCClientProvider.instance.initialize();
    }
    return OIDCClientProvider.instance;
  }
}
