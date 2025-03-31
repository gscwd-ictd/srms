import {
  I_ApplicantionRepository,
  I_PlumbingFixtureRepository,
  I_ServiceableAreaRepository,
} from "./interfaces";
import { ApplicantionRepository, PlumbingFixtureRepository, ServiceableAreaRepository } from "./repositories";
import { ApplicationService, PlumbingFixtureService, ServiceableAreaService } from "./services";

export class NSAManager {
  // Singleton instance of NSAManager
  private static instance: NSAManager;

  // Application-related services and repositories
  private applicationService: ApplicationService;
  private applicationRepository: I_ApplicantionRepository;

  // Plumbing-related services and repositories
  private plumbingFixtureService: PlumbingFixtureService;
  private plumbingFixtureRepository: I_PlumbingFixtureRepository;

  // Serviceable-related service and repositories
  private serviceableAreaService: ServiceableAreaService;
  private serviceableAreaRepository: I_ServiceableAreaRepository;

  // Private constructor to prevent direct instantiation
  private constructor() {
    // Initialize application repository and service
    this.applicationRepository = new ApplicantionRepository();
    this.applicationService = new ApplicationService(this.applicationRepository);

    // Initialize plumbing repository and service
    this.plumbingFixtureRepository = new PlumbingFixtureRepository();
    this.plumbingFixtureService = new PlumbingFixtureService(this.plumbingFixtureRepository);

    // Initialize serviceable repository and service
    this.serviceableAreaRepository = new ServiceableAreaRepository();
    this.serviceableAreaService = new ServiceableAreaService(this.serviceableAreaRepository);
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

  // Getter for serviceable area repository
  public getServiceableAreaRepository(): I_ServiceableAreaRepository {
    return this.serviceableAreaRepository;
  }

  // Getter for serviceable area service
  public getServiceableAreaService(): ServiceableAreaService {
    return this.serviceableAreaService;
  }
}
