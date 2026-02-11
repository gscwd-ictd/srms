import { ValvesGeoJSON } from "../../types";

export interface I_ValvesService {
  getValvesGeoJson(): Promise<ValvesGeoJSON>;
}
