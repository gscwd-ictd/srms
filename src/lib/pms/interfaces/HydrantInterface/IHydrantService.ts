import { HydrantGeoJSON } from "../../types";

export interface I_HydrantService {
  getHydrantGeoJson(): Promise<HydrantGeoJSON>;
}
