import { createOpenAPIRoute } from "@srms/server/openapi/createOpenApiRoute";
import * as routes from "./serviceableArea.routes";
import * as handlers from "./serviceableArea.handlers";

const serviceableAreaRoute = createOpenAPIRoute().openapi(
  routes.getAllServiceableAreas,
  handlers.getAllServiceableAreas,
);

export default serviceableAreaRoute;
