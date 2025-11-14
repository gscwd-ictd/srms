import { PipelinesService, ValvesService, LoggersService, PumpingStationsService, ReservoirService } from "./services";

export class PmsManager {
  private static instance: PmsManager;

  private valvesService: ValvesService;

  private pipelinesService: PipelinesService;

  private loggersService: LoggersService;

  private pumpingStationsService: PumpingStationsService;

  private reservoirService: ReservoirService;

  private constructor() {
    this.valvesService = new ValvesService();
    this.pipelinesService = new PipelinesService();
    this.loggersService = new LoggersService();
    this.pumpingStationsService = new PumpingStationsService();
    this.reservoirService = new ReservoirService();
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

  public getPumpingStationsService(): PumpingStationsService {
    return this.pumpingStationsService;
  }

  public getReservoirService(): ReservoirService {
    return this.reservoirService;
  }
}
