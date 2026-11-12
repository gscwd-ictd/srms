import { BarangayGeoJSON } from "../types";
import { I_BarangayService } from "../interfaces";
import { HydrantDoesNotExistError } from "../errors/HydrantError/HydrantDoesNotExistError";
import axios from "axios";
import env from "@srms/utils/env";
import { isEmpty } from "@srms/utils/isEmpty";

export class BarangayService implements I_BarangayService {
  /**
   *
   * @param data Details about the valves.
   *
   * @returns
   */
  async getBarangayGeoJson(): Promise<BarangayGeoJSON> {
    const geoServerUrl = env.NEXT_PUBLIC_GEOSERVER_URL;
    const geoServerWorkspace = env.NEXT_PUBLIC_GEOSERVER_WORKSPACE;
    const barangayLayerName = env.BARANGAY_LAYER_NAME;
    const geoserverUsername = env.NEXT_PUBLIC_GEOSERVER_USERNAME;
    const geoserverPassword = env.NEXT_PUBLIC_GEOSERVER_PASSWORD;

    const urlString = `${geoServerUrl}/${geoServerWorkspace}/ows?service=WFS&version=2.0.0&request=GetFeature&typeNames=${geoServerWorkspace}:${barangayLayerName}&maxFeatures=2500&outputFormat=application/json&srsName=EPSG:4326`;

    // added username and password in case URL is changed to cloud.
    const response = await axios.get<BarangayGeoJSON>(urlString, {
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
