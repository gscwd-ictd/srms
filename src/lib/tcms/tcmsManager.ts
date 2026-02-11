import { I_ConsumerRepository } from "./interfaces";
import { ConsumerRepository } from "./repositories/ConsumerRepository";
import { ConsumerService } from "./services";

export class TCMSManager {
  private static instance: TCMSManager;
  private consumerService: ConsumerService;
  private consumerRepository: I_ConsumerRepository;

  private constructor() {
    this.consumerRepository = new ConsumerRepository();
    this.consumerService = new ConsumerService(this.consumerRepository);
  }

  public static getInstance(): TCMSManager {
    if (!this.instance) {
      this.instance = new TCMSManager();
    }
    return this.instance;
  }

  public getConsumerRepository(): I_ConsumerRepository {
    return this.consumerRepository;
  }

  public getConsumerService(): ConsumerService {
    return this.consumerService;
  }
}
