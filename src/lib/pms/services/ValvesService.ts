import { ValvesGeoJSON } from "../types";
import { I_ValvesService } from "../interfaces";
import { ValvesDoesNotExistError } from "../errors/ValvesError/ValvesDoesNotExistError";
import axios from "axios";
import env from "@srms/utils/env";
import { isEmpty } from "@srms/utils/isEmpty";

export class ValvesService implements I_ValvesService {
  /**
   *
   * @param data Details about the valves.
   *
   * @returns
   */
  async getValvesGeoJson(): Promise<ValvesGeoJSON> {
    const geoServerUrl = env.NEXT_PUBLIC_GEOSERVER_URL;
    const geoServerWorkspace = env.NEXT_PUBLIC_GEOSERVER_WORKSPACE;
    const valveLayerName = env.VALVE_LAYER_NAME;
    const geoserverUsername = env.NEXT_PUBLIC_GEOSERVER_USERNAME;
    const geoserverPassword = env.NEXT_PUBLIC_GEOSERVER_PASSWORD;

    const urlString = `${geoServerUrl}/${geoServerWorkspace}/ows?service=WFS&version=2.0.0&request=GetFeature&typeNames=${geoServerWorkspace}:${valveLayerName}&maxFeatures=2500&outputFormat=application/json&srsName=EPSG:4326`;

    // added username and password in case URL is changed to cloud.
    const response = await axios.get<ValvesGeoJSON>(urlString, {
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
      throw new ValvesDoesNotExistError(`Returned ${response.data.totalFeatures} rows of data`);
    }
  }
}
