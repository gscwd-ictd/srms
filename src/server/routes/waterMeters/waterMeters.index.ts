import * as routes from "./waterMeters.routes";
import * as handlers from "./waterMeters.handler";
import { createOpenAPIRoute } from "@srms/server/openapi/createOpenApiRoute";

const watermeters = createOpenAPIRoute()
  .openapi(routes.getWaterMetersGeoJson, handlers.getWaterMetersGeoJson)
  .openapi(routes.getConsumersMeterDetails, handlers.getConsumersMeterDetails)
  .openapi(routes.getConsumersMeterDetailsByFilter, handlers.getConsumersMeterDetailsByFilter);

export default watermeters;
