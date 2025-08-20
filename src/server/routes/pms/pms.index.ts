import * as routes from "./pms.routes";
import * as handlers from "./pms.handler";
import { createOpenAPIRoute } from "@srms/server/openapi/createOpenApiRoute";

const pms = createOpenAPIRoute()
  .openapi(routes.getValvesGeoJson, handlers.getValvesGeoJson)
  .openapi(routes.getPipelinesGeoJson, handlers.getPipelinesGeoJson);

export default pms;
