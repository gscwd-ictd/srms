import { I_PlumbingFixtureRepository } from "./interfaces/IPlumbingFixtureRepository";
import { PlumbingFixtureRepository } from "./repositories/PlumbingFixtureRepository";
import { PlumbingFixtureService } from "./services/PlumbingFixtureService";

export class PlumbingFixtureManager {
  private static instance: PlumbingFixtureManager;
  private _plumbingFixtureService: PlumbingFixtureService;
  private _plumbingFixtureRepository: I_PlumbingFixtureRepository;

  constructor() {
    this._plumbingFixtureRepository = new PlumbingFixtureRepository();
    this._plumbingFixtureService = new PlumbingFixtureService(this._plumbingFixtureRepository);
  }

  private static init() {
    if (!this.instance) {
      this.instance = new PlumbingFixtureManager();
    }
    return this.instance;
  }

  public static getInstance(): PlumbingFixtureManager {
    return this.init();
  }

  get plumbingFixtureRepository(): I_PlumbingFixtureRepository {
    return this._plumbingFixtureRepository;
  }

  get plumbingFixtureService(): PlumbingFixtureService {
    return this._plumbingFixtureService;
  }
}
