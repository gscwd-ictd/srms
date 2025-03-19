import { I_ApplicantionRepository, I_PlumbingFixtureRepository } from "./interfaces";
import { ApplicantionRepository } from "./repositories/ApplicationRepository";
import { PlumbingFixtureRepository } from "./repositories/PlumbingFixtureRepository";
import { ApplicationService } from "./services/ApplicationService";
import { PlumbingFixtureService } from "./services/PlumbingFixtureService";

export class NSAManager {
  // Singleton instance of NSAManager
  private static instance: NSAManager;

  // Application-related services and repositories
  private applicationService: ApplicationService;
  private applicationRepository: I_ApplicantionRepository;

  // Plumbing-related services and repositories
  private plumbingFixtureService: PlumbingFixtureService;
  private plumbingFixtureRepository: I_PlumbingFixtureRepository;

  // Private constructor to prevent direct instantiation
  private constructor() {
    // Initialize application repository and service
    this.applicationRepository = new ApplicantionRepository();
    this.applicationService = new ApplicationService(this.applicationRepository);

    // Initialize plumbing repository and service
    this.plumbingFixtureRepository = new PlumbingFixtureRepository();
    this.plumbingFixtureService = new PlumbingFixtureService(this.plumbingFixtureRepository);
  }

  // Returns the singleton instance of NSAManager
  public static getInstance(): NSAManager {
    if (!this.instance) {
      this.instance = new NSAManager();
    }
    return this.instance;
  }

  // Getter for application repository
  public getApplicationRepository(): I_ApplicantionRepository {
    return this.applicationRepository;
  }

  // Getter for application service
  public getApplicationService(): ApplicationService {
    return this.applicationService;
  }

  // Getter for plumbing fixture repository
  public getPlumbingFixtureRepository(): I_PlumbingFixtureRepository {
    return this.plumbingFixtureRepository;
  }

  // Getter for plumbing fixture service
  public getPlumbingFixtureService(): PlumbingFixtureService {
    return this.plumbingFixtureService;
  }
}
