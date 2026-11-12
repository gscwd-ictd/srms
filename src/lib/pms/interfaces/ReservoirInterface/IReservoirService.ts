import { ReservoirGeoJSON } from "../../types";

export interface I_ReservoirService {
  getReservoirsGeoJson(): Promise<ReservoirGeoJSON>;
}
