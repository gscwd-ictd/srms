import { MeterSizingApplicationDetails, MeterSizingDemandDetails } from "../../types";

export interface I_MeterSizingCalculatorRepository {
  getTotalDemand(applicationDetails: MeterSizingApplicationDetails): Promise<MeterSizingDemandDetails>;
}
