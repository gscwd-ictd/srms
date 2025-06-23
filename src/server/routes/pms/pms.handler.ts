import { AppRouteHandler } from "@srms/server/types/appTypes";
import { GetGValvesGeoJsonRoute } from "./pms.routes";
import { pmsManager } from "@srms/server/app";

export const getValvesGeoJson: AppRouteHandler<GetGValvesGeoJsonRoute> = async (c) => {
  const geoValvesGeoJson = await pmsManager.getValvesService().getValvesGeoJson();

  return c.json(geoValvesGeoJson, 200);
};
