import { ValvesService } from "./services";

export class PmsManager {
  private static instance: PmsManager;

  private valvesService: ValvesService;

  private constructor() {
    this.valvesService = new ValvesService();
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
}
