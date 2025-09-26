import { I_ApplicantionRepository } from "./interfaces";
import { ApplicantionRepository } from "./repositories/ApplicationRepository";
import { ApplicationService } from "./services";

export class ApplicationManager {
  private static instance: ApplicationManager;
  private _applicationService: ApplicationService;
  private _applicationRepository: I_ApplicantionRepository;

  constructor() {
    this._applicationRepository = new ApplicantionRepository();
    this._applicationService = new ApplicationService(this._applicationRepository);
  }

  private static init() {
    if (!this.instance) {
      this.instance = new ApplicationManager();
    }
    return this.instance;
  }

  public static getInstance(): ApplicationManager {
    return this.init();
  }

  get applicationRepository(): I_ApplicantionRepository {
    return this._applicationRepository;
  }

  get applicationService(): ApplicationService {
    return this._applicationService;
  }
}
