import { ReservoirGEOJSON } from "../../types";

export interface I_ReservoirService {
  getReservoirsGeoJson(): Promise<ReservoirGEOJSON>;
}