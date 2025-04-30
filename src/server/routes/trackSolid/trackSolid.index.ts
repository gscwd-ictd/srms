import * as routes from "./trackSolid.routes";
import * as handlers from "./trackSolid.handler";
import { createOpenAPIRoute } from "@srms/server/openapi/createOpenApiRoute";

const tracksolid = createOpenAPIRoute()
  .openapi(routes.getTsAccessToken, handlers.getTsAccessToken)
  .openapi(routes.getTsRefreshToken, handlers.getTsRefreshToken)
  .openapi(routes.getDevices, handlers.getDevices)
  .openapi(routes.getDeviceDetail, handlers.getDeviceDetail)
  .openapi(routes.getDevicesLocation, handlers.getDevicesLocation);

export default tracksolid;
