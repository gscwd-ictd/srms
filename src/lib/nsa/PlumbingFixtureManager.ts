import { I_PlumbingFixtureRepository } from "./interfaces";
import { PlumbingFixtureRepository } from "./repositories";
import { FixtureUnitRepository } from "./repositories/FixtureUnitsRepository";
import { PlumbingFixtureService } from "./services";
import { FixtureUnitService } from "./services/FixtureUnitsService";

export class PlumbingFixtureManager {
  private static instance: PlumbingFixtureManager;
  private _plumbingFixtureService: PlumbingFixtureService;
  private _plumbingFixtureRepository: I_PlumbingFixtureRepository;
  private _fixtureUnitRepository: FixtureUnitRepository;
  private _fixtureUnitService: FixtureUnitService;

  constructor() {
    this._plumbingFixtureRepository = new PlumbingFixtureRepository();
    this._plumbingFixtureService = new PlumbingFixtureService(this._plumbingFixtureRepository);
    this._fixtureUnitRepository = new FixtureUnitRepository(this._plumbingFixtureService);
    this._fixtureUnitService = new FixtureUnitService(this._fixtureUnitRepository);
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

  public get fixtureUnitService(): FixtureUnitService {
    return this._fixtureUnitService;
  }

  public get fixtureUnitRepository(): FixtureUnitRepository {
    return this._fixtureUnitRepository;
  }
}
