import { PumpingStationGEOJSON } from "../../types";

export interface I_PumpingStationsService {
    getPumpingStationsGeoJson(): Promise<PumpingStationGEOJSON>;
}