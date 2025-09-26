import { I_ApplicantionRepository, I_PlumbingFixtureRepository } from "./interfaces";
import { FixtureUnitRepository } from "./repositories";
import { ApplicantionRepository } from "./repositories/ApplicationRepository";
import { MeterSizingCalculatorRepository } from "./repositories/MeterSizingCalculatorRepository";
import { PlumbingFixtureRepository } from "./repositories/PlumbingFixtureRepository";
import { FixtureUnitService } from "./services";
import { ApplicationService } from "./services/ApplicationService";
import { MeterSizingCalculatorService } from "./services/MeterSizingCalculatorService";
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

  //fixture units
  private fixtureUnitRepository: FixtureUnitRepository;
  private fixtureUnitService: FixtureUnitService;

  //NSA Calculator
  private meterSizingCalculatorService: MeterSizingCalculatorService;
  private meterSizingCalculatorRepository: MeterSizingCalculatorRepository;

  // Private constructor to prevent direct instantiation
  private constructor() {
    // Initialize application repository and service
    this.applicationRepository = new ApplicantionRepository();
    this.applicationService = new ApplicationService(this.applicationRepository);

    // Initialize plumbing repository and service
    this.plumbingFixtureRepository = new PlumbingFixtureRepository();
    this.plumbingFixtureService = new PlumbingFixtureService(this.plumbingFixtureRepository);

    //Initialize Fixture Units Repository and service
    this.fixtureUnitRepository = new FixtureUnitRepository(this.plumbingFixtureService);
    this.fixtureUnitService = new FixtureUnitService(this.fixtureUnitRepository);

    //Initialize MeterSizing Calculator Repository and Service;
    this.meterSizingCalculatorRepository = new MeterSizingCalculatorRepository();
    this.meterSizingCalculatorService = new MeterSizingCalculatorService(
      this.meterSizingCalculatorRepository,
    );
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

  public getFixtureUnitService(): FixtureUnitService {
    return this.fixtureUnitService;
  }

  public getFixtureUnitRepository(): FixtureUnitRepository {
    return this.fixtureUnitRepository;
  }

  public getMeterSizingCalculatorService(): MeterSizingCalculatorService {
    return this.meterSizingCalculatorService;
  }

  public getMeterSizingCalculatorRepository(): MeterSizingCalculatorRepository {
    return this.meterSizingCalculatorRepository;
  }
}
