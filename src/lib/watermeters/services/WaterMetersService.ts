import { WaterMeterFilter, WaterMetersGeoJSON } from "../types";
import axios from "axios";
import env from "@srms/utils/env";
import { isEmpty } from "@srms/utils/isEmpty";
import { WaterMetersDoesNotExistError } from "../errors/WaterMetersError/WaterMetersDoesNotExistError";
import { I_WaterMetersService } from "../interfaces";

export class WaterMetersService implements I_WaterMetersService {
  /**
   *
   * @param data Details about the water meters.
   *
   * @returns
   */
  async getWaterMetersGeoJson(): Promise<WaterMetersGeoJSON> {
    const geoServerUrl = env.NEXT_PUBLIC_GEOSERVER_URL;
    const geoServerWorkspace = env.NEXT_PUBLIC_GEOSERVER_WORKSPACE;
    const waterMetersLayerName = env.WATER_METERS_LAYER_NAME;
    const geoserverUsername = env.NEXT_PUBLIC_GEOSERVER_USERNAME;
    const geoserverPassword = env.NEXT_PUBLIC_GEOSERVER_PASSWORD;

    const urlString = `${geoServerUrl}/${geoServerWorkspace}/ows?service=WFS&version=2.0.0&request=GetFeature&typeNames=${geoServerWorkspace}:${waterMetersLayerName}&outputFormat=application/json&srsName=EPSG:4326`;

    // added username and password in case URL is changed to cloud.
    const response = await axios.get<WaterMetersGeoJSON>(urlString, {
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
      throw new WaterMetersDoesNotExistError(`Returned ${response.data.totalFeatures} rows of data`);
    }
  }

  async getConsumersMeterDetails(pageIndex: string, pageSize: string): Promise<WaterMetersGeoJSON> {
    const geoServerUrl = env.NEXT_PUBLIC_GEOSERVER_URL;
    const geoServerWorkspace = env.NEXT_PUBLIC_GEOSERVER_WORKSPACE;
    const waterMetersLayerName = env.WATER_METERS_LAYER_NAME;
    const geoserverUsername = env.NEXT_PUBLIC_GEOSERVER_USERNAME;
    const geoserverPassword = env.NEXT_PUBLIC_GEOSERVER_PASSWORD;

    const startIndex = parseInt(pageIndex) === 0 ? 0 : parseInt(pageIndex) * parseInt(pageSize);

    const urlString = `${geoServerUrl}/${geoServerWorkspace}/ows?service=WFS&version=2.0.0&request=GetFeature&typeNames=${geoServerWorkspace}:${waterMetersLayerName}&outputFormat=application/json&srsName=EPSG:4326&startIndex=${startIndex}&count=${pageSize}&sortBy=accountno`;

    // added username and password in case URL is changed to cloud.
    const response = await axios.get<WaterMetersGeoJSON>(urlString, {
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
      throw new WaterMetersDoesNotExistError(`Returned ${response.data.totalFeatures} rows of data`);
    }
  }

  async getConsumersMeterDetailsByFilter(
    pageIndex: string,
    pageSize: string,
    filters: Array<WaterMeterFilter>,
  ): Promise<WaterMetersGeoJSON> {
    const geoServerUrl = env.NEXT_PUBLIC_GEOSERVER_URL;
    const geoServerWorkspace = env.NEXT_PUBLIC_GEOSERVER_WORKSPACE;
    const waterMetersLayerName = env.WATER_METERS_LAYER_NAME;
    const geoserverUsername = env.NEXT_PUBLIC_GEOSERVER_USERNAME;
    const geoserverPassword = env.NEXT_PUBLIC_GEOSERVER_PASSWORD;

    const startIndex = parseInt(pageIndex) === 0 ? 0 : parseInt(pageIndex) * parseInt(pageSize);

    const filterToFormat = () => {
      let filterStr = "";

      filters.map((filter, index) => {
        const colName = filter.id.replace("properties_", "");

        if (index === 0 || index === filters.length - 1) {
          filterStr = filterStr + `${colName} ILIKE '%25${filter.value}%25'`;
        } else {
          filterStr = filterStr + `${colName} ILIKE '%25${filter.value}%25' AND `;
        }
      });

      return filterStr;
    };

    const urlString = `${geoServerUrl}/${geoServerWorkspace}/ows?service=WFS&version=2.0.0&request=GetFeature&typeNames=${geoServerWorkspace}:${waterMetersLayerName}&outputFormat=application/json&srsName=EPSG:4326&startIndex=${startIndex}&count=${pageSize}&sortBy=accountno&cql_filter=${filterToFormat()}`;

    // added username and password in case URL is changed to cloud.
    const response = await axios.get<WaterMetersGeoJSON>(urlString, {
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
      throw new WaterMetersDoesNotExistError(`Returned ${response.data.totalFeatures} rows of data`);
    }
  }
}
