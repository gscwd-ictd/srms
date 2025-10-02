import { PipelinesService, ValvesService, LoggersService } from "./services";

export class PmsManager {
  private static instance: PmsManager;

  private valvesService: ValvesService;

  private pipelinesService: PipelinesService;

  private loggersService: LoggersService;

  private constructor() {
    this.valvesService = new ValvesService();
    this.pipelinesService = new PipelinesService();
    this.loggersService = new LoggersService();
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

  public getLoggersService(): LoggersService {
    return this.loggersService;
  }
}
