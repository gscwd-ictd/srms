import { HydrantGeoJSON } from "../types";
import { I_HydrantService } from "../interfaces";
import { HydrantDoesNotExistError } from "../errors/HydrantError/HydrantDoesNotExistError";
import axios from "axios";
import env from "@srms/utils/env";
import { isEmpty } from "@srms/utils/isEmpty";

export class HydrantService implements I_HydrantService {
  /**
   *
   * @param data Details about the valves.
   *
   * @returns
   */
  async getHydrantGeoJson(): Promise<HydrantGeoJSON> {
    const geoServerUrl = env.NEXT_PUBLIC_GEOSERVER_URL;
    const geoServerWorkspace = env.NEXT_PUBLIC_GEOSERVER_WORKSPACE;
    const hydrantLayerName = env.HYDRANT_LAYER_NAME;
    const geoserverUsername = env.NEXT_PUBLIC_GEOSERVER_USERNAME;
    const geoserverPassword = env.NEXT_PUBLIC_GEOSERVER_PASSWORD;

    const urlString = `${geoServerUrl}/${geoServerWorkspace}/ows?service=WFS&version=2.0.0&request=GetFeature&typeNames=${geoServerWorkspace}:${hydrantLayerName}&maxFeatures=2500&outputFormat=application/json&srsName=EPSG:4326`;

    // added username and password in case URL is changed to cloud.
    const response = await axios.get<HydrantGeoJSON>(urlString, {
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
      throw new HydrantDoesNotExistError(`Returned ${response.data.totalFeatures} rows of data`);
    }
  }
}
