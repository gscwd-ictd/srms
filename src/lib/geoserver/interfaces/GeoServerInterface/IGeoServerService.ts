import { GeoserverLayer } from "../../types/GeoServer";

export interface I_GeoServerService {
  getGeoServerLayers(): Promise<Array<GeoserverLayer>>;
  getPipelineLayer(): Promise<GeoserverLayer>;
}
