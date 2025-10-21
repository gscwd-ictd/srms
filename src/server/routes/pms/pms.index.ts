import * as routes from "./pms.routes";
import * as handlers from "./pms.handler";
import { createOpenAPIRoute } from "@srms/server/openapi/createOpenApiRoute";

const pms = createOpenAPIRoute()
  .openapi(routes.getValvesGeoJson, handlers.getValvesGeoJson)
  .openapi(routes.getPipelinesGeoJson, handlers.getPipelinesGeoJson)
  .openapi(routes.getXilogLoggersList, handlers.getXilogLoggersList)
  .openapi(routes.getXilogLoggerChannelEntries, handlers.getXilogLoggerChannelEntries)
  .openapi(routes.getXilogChannelLatestEntries, handlers.getXilogChannelLatestEntries);

export default pms;
