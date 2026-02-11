import { MeterSizingApplicationDetails, MeterSizingDemandDetails } from "../../types";

export interface I_MeterSizingCalculatorService {
  getTotalDemand(applicationDetails: MeterSizingApplicationDetails): Promise<MeterSizingDemandDetails>;
}
