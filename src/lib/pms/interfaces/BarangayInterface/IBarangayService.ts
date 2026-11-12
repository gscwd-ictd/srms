import { BarangayGeoJSON } from "../../types";

export interface I_BarangayService {
  getBarangayGeoJson(): Promise<BarangayGeoJSON>;
}
