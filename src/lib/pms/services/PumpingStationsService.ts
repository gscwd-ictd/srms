import { PumpingStationGEOJSON } from "../types";
import axios from "axios";
import env from "@srms/utils/env";
import { isEmpty } from "@srms/utils/isEmpty";
import { I_PumpingStationsService } from "../interfaces/PumpingStationsInterface";

export class PumpingStationsService implements I_PumpingStationsService {
    async getPumpingStationsGeoJson(): Promise<PumpingStationGEOJSON> {
        const geoServerUrl = env.NEXT_PUBLIC_GEOSERVER_URL;
        const geoServerWorkspace = env.NEXT_PUBLIC_GEOSERVER_WORKSPACE;
        const pumpStationLayerName = env.PUMPING_STATION_LAYER_NAME;
        const geoserverUsername = env.NEXT_PUBLIC_GEOSERVER_USERNAME;
        const geoserverPassword = env.NEXT_PUBLIC_GEOSERVER_PASSWORD;

        const urlString = `${geoServerUrl}/${geoServerWorkspace}/ows?service=WFS&version=2.0.0&request=GetFeature&typeNames=${geoServerWorkspace}:${pumpStationLayerName}&maxFeatures=2500&outputFormat=application/json&srsName=EPSG:4326`;

        // added username and password in case URL is changed to cloud.
        const response = await axios.get<PumpingStationGEOJSON>(urlString, {
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