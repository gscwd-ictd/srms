import { WaterMeterFilter, WaterMetersGeoJSON } from "../../types";

export interface I_WaterMetersService {
  getWaterMetersGeoJson(): Promise<WaterMetersGeoJSON>;
  getConsumersMeterDetails(pageIndex: string, pageSize: string): Promise<WaterMetersGeoJSON>;
  getConsumersMeterDetailsByFilter(
    pageIndex: string,
    pageSize: string,
    filters: Array<WaterMeterFilter>,
  ): Promise<WaterMetersGeoJSON>;
}
