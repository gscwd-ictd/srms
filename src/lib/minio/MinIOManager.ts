import { MinIoService } from "./services/MinIoService";

export class MinIOManager {
  public static instance = this;

  private constructor(private readonly minIoService: MinIoService) {}

  public static getInstance(minIOService: MinIoService) {
    if (this === undefined) {
      const manager = new MinIOManager(minIOService);
      return manager;
    }
  }

  get minIOService() {
    return this.minIoService;
  }
}

const minIOService = new MinIoService("", {});

export const minIOManager = MinIOManager.getInstance(minIOService);
