import { AppRouteHandler } from "@srms/server/types/appTypes";
import { GetGValvesGeoJsonRoute, GetPipelinesGeoJsonRoute } from "./pms.routes";
import { pmsManager } from "@srms/server/app";

export const getValvesGeoJson: AppRouteHandler<GetGValvesGeoJsonRoute> = async (c) => {
  const geoValvesGeoJson = await pmsManager.getValvesService().getValvesGeoJson();

  return c.json(geoValvesGeoJson, 200);
};

export const getPipelinesGeoJson: AppRouteHandler<GetPipelinesGeoJsonRoute> = async (c) => {
  const geoPipelinesGeoJson = await pmsManager.getPipelinesService().getPipelinesGeoJson();

  return c.json(geoPipelinesGeoJson, 200);
};
