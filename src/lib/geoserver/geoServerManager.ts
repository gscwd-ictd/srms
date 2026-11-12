import { GeoServerService } from "./services/GeoServerService";

export class GeoServerManager {
  private static instance: GeoServerManager;

  private geoServerService: GeoServerService;

  private constructor() {
    this.geoServerService = new GeoServerService();
  }

  public static getInstance(): GeoServerManager {
    if (!this.instance) {
      this.instance = new GeoServerManager();
    }
    return this.instance;
  }

  public getGeoServerService(): GeoServerService {
    return this.geoServerService;
  }
}
