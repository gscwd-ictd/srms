import env from "@srms/utils/env";
import { DataStores, GeoserverLayer } from "../types";
import { I_GeoServerService } from "../interfaces/";
import axios from "axios";

export class GeoServerService implements I_GeoServerService {
  async getGeoServerLayers(): Promise<Array<GeoserverLayer>> {
    const geoserverUrl = env.GEOSERVER_URL;
    const geoserverWorkspace = env.GEOSERVER_WORKSPACE;
    const geoserverUsername = env.GEOSERVER_USERNAME;
    const geoserverPassword = env.GEOSERVER_PASSWORD;

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
}
