import env from "@srms/utils/env";
import { DataStores, GeoserverLayer } from "../types";
import { I_GeoServerService } from "../interfaces/";
import axios from "axios";

export class GeoServerService implements I_GeoServerService {
  async getGeoServerLayers(): Promise<Array<GeoserverLayer>> {
    const geoserverUrl = env.NEXT_PUBLIC_GEOSERVER_URL;
    const geoserverWorkspace = env.NEXT_PUBLIC_GEOSERVER_WORKSPACE;
    const geoserverUsername = env.NEXT_PUBLIC_GEOSERVER_USERNAME;
    const geoserverPassword = env.NEXT_PUBLIC_GEOSERVER_PASSWORD;

    const response = await axios.get<DataStores>(
      `${geoserverUrl}/rest/workspaces/${geoserverWorkspace}/datastores.json`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: geoserverUsername,
          password: geoserverPassword,
        },
      },
    );

    return response.data.dataStores.dataStore;
  }

  async getValvesLayers(): Promise<GeoserverLayer> {
    const geoServerLayers = await this.getGeoServerLayers();

    const valveLayer = geoServerLayers.filter((layer) => layer.name && layer.name === "Valves2025-1A"); //From geoserver layers

    return valveLayer[0]!;
  }

  async getPipelineLayer(): Promise<GeoserverLayer> {
    const geoServerLayers = await this.getGeoServerLayers();

    const pipeLayer = geoServerLayers.filter((layer) => layer.name && layer.name === "Pipeline2025-8"); //From geoserver layers

    return pipeLayer[0]!;
  }
}
