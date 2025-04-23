import { geoServerManager } from "@srms/server/app";
import { AppRouteHandler } from "@srms/server/types/appTypes";
import { GetGeoServerRoute } from "./geoServer.routes";

export const getGeoServerLayers: AppRouteHandler<GetGeoServerRoute> = async (c) => {
  const geoServerLayers = await geoServerManager.getGeoServerService().getGeoServerLayers();

  return c.json(geoServerLayers, 200);
};
