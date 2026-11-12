import { ReservoirGeoJSON } from "../types";
import axios from "axios";
import env from "@srms/utils/env";
import { isEmpty } from "@srms/utils/isEmpty";
import { I_ReservoirService } from "../interfaces/ReservoirInterface";

export class ReservoirService implements I_ReservoirService {
  async getReservoirsGeoJson(): Promise<ReservoirGeoJSON> {
    const geoServerUrl = env.NEXT_PUBLIC_GEOSERVER_URL;
    const geoServerWorkspace = env.NEXT_PUBLIC_GEOSERVER_WORKSPACE;
    const reservoirLayerName = env.RESERVOIR_LAYER_NAME;
    const geoserverUsername = env.NEXT_PUBLIC_GEOSERVER_USERNAME;
    const geoserverPassword = env.NEXT_PUBLIC_GEOSERVER_PASSWORD;

    const urlString = `${geoServerUrl}/${geoServerWorkspace}/ows?service=WFS&version=2.0.0&request=GetFeature&typeNames=${geoServerWorkspace}:${reservoirLayerName}&maxFeatures=2500&outputFormat=application/json&srsName=EPSG:4326`;

    // added username and password in case URL is changed to cloud.
    const response = await axios.get<ReservoirGeoJSON>(urlString, {
      headers: {
        "Content-Type": "application/json",
      },
      auth: {
        username: geoserverUsername,
        password: geoserverPassword,
      },
    });

    if (!isEmpty(response.data)) {
      return response.data;
    } else {
      throw new Error(`Returned ${response.data.totalFeatures} rows of data`);
    }
  }
}
