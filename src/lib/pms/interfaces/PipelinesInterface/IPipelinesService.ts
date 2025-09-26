import { PipelinesGeoJSON } from "../../types";

export interface I_PipelinesService {
  getPipelinesGeoJson(): Promise<PipelinesGeoJSON>;
}
