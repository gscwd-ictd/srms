import { WaterMetersGeoJSON } from "../../types";

export interface I_WaterMetersService {
  getWaterMetersGeoJson(): Promise<WaterMetersGeoJSON>;
}
