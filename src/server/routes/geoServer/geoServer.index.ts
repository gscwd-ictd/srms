import * as routes from "./geoServer.routes";
import * as handlers from "./geoServer.handler";
import { createOpenAPIRoute } from "@srms/server/openapi/createOpenApiRoute";

const geoserver = createOpenAPIRoute().openapi(routes.getGeoServerLayers, handlers.getGeoServerLayers);

export default geoserver;
