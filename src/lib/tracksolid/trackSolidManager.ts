import { TrackSolidService } from "./services/TrackSolidService";

export class TrackSolidManager {
  private static instance: TrackSolidManager;

  private trackSolidService: TrackSolidService;

  private constructor() {
    this.trackSolidService = new TrackSolidService();
  }

  public static getInstance(): TrackSolidManager {
    if (!this.instance) {
      this.instance = new TrackSolidManager();
    }
    return this.instance;
  }

  public getTrackSolidService(): TrackSolidService {
    return this.trackSolidService;
  }
}
