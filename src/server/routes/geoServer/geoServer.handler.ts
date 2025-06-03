import { geoServerManager } from "@srms/server/app";
import { AppRouteHandler } from "@srms/server/types/appTypes";
import { GetGeoServerRoute, GetPipelineRoute } from "./geoServer.routes";

export const getGeoServerLayers: AppRouteHandler<GetGeoServerRoute> = async (c) => {
  const geoServerLayers = await geoServerManager.getGeoServerService().getGeoServerLayers();

  return c.json(geoServerLayers, 200);
};

export const getPipelineLayer: AppRouteHandler<GetPipelineRoute> = async (c) => {
  const pipeLineLayer = await geoServerManager.getGeoServerService().getPipelineLayer();

  return c.json(pipeLineLayer, 200);
};
