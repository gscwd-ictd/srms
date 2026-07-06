import { AuthService } from "./services/AuthService";

export class AuthManager {
  private static instance: AuthManager;

  private authService: AuthService;

  private constructor() {
    this.authService = new AuthService();
  }

  public static getInstance(): AuthManager {
    if (!this.instance) {
      this.instance = new AuthManager();
    }
    return this.instance;
  }

  public getAuthService(): AuthService {
    return this.authService;
  }
}
