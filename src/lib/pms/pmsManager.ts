import { PipelinesService, ValvesService } from "./services";

export class PmsManager {
  private static instance: PmsManager;

  private valvesService: ValvesService;

  private pipelinesService: PipelinesService;

  private constructor() {
    this.valvesService = new ValvesService();
    this.pipelinesService = new PipelinesService();
  }

  public static getInstance(): PmsManager {
    if (!this.instance) {
      this.instance = new PmsManager();
    }
    return this.instance;
  }

  public getValvesService(): ValvesService {
    return this.valvesService;
  }

  public getPipelinesService(): PipelinesService {
    return this.pipelinesService;
  }
}
