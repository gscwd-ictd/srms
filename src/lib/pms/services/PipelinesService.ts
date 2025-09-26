import { PipelinesGeoJSON } from "../types";
import { I_PipelinesService } from "../interfaces";
import axios from "axios";
import env from "@srms/utils/env";
import { isEmpty } from "@srms/utils/isEmpty";
import { PipelinesDoesNotExistError } from "../errors/PipelinesError/PipelinesDoesNotExistError";

export class PipelinesService implements I_PipelinesService {
  /**
   *
   * @param data Details about the valves.
   *
   * @returns
   */
  async getPipelinesGeoJson(): Promise<PipelinesGeoJSON> {
    const geoServerUrl = env.NEXT_PUBLIC_GEOSERVER_URL;
    const geoServerWorkspace = env.NEXT_PUBLIC_GEOSERVER_WORKSPACE;
    const pipelineLayerName = env.PIPELINE_LAYER_NAME;
    const geoserverUsername = env.NEXT_PUBLIC_GEOSERVER_USERNAME;
    const geoserverPassword = env.NEXT_PUBLIC_GEOSERVER_PASSWORD;

    const urlString = `${geoServerUrl}/${geoServerWorkspace}/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${geoServerWorkspace}:${pipelineLayerName}&outputFormat=application/json&srsName=EPSG:4326`;

    // added username and password in case URL is changed to cloud.
    const response = await axios.get<PipelinesGeoJSON>(urlString, {
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
      throw new PipelinesDoesNotExistError(`Returned ${response.data.totalFeatures} rows of data`);
    }
  }
}
