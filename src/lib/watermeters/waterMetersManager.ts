import { WaterMetersService } from "./services";

export class WaterMetersManager {
  private static instance: WaterMetersManager;

  private waterMetersService: WaterMetersService;

  private constructor() {
    this.waterMetersService = new WaterMetersService();
  }

  public static getInstance(): WaterMetersManager {
    if (!this.instance) {
      this.instance = new WaterMetersManager();
    }
    return this.instance;
  }

  public getWaterMetersService(): WaterMetersService {
    return this.waterMetersService;
  }
}
