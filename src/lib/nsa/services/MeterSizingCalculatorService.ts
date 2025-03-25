import { I_MeterSizingCalculatorService } from "../interfaces/MeterSizingCalculatorInterface/IMeterSizingCalculatorService";
import { MeterSizingCalculatorRepository } from "../repositories/MeterSizingCalculatorRepository";
import { MeterSizingApplicationDetails, MeterSizingDemandDetails } from "../types";

export class MeterSizingCalculatorService implements I_MeterSizingCalculatorService {
  constructor(private readonly meterSizingRepository: MeterSizingCalculatorRepository) {}
  async getTotalDemand(applicationDetails: MeterSizingApplicationDetails): Promise<MeterSizingDemandDetails> {
    return await this.meterSizingRepository.getTotalDemand(applicationDetails);
  }
}
