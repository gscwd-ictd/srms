import * as routes from "./serviceableAreas.routes";
import * as handlers from "./serviceableAreas.handlers";
import { createOpenAPIRoute } from "@srms/lib/openapi";

const serviceableAreas = createOpenAPIRoute()
  .openapi(routes.addServiceableArea, handlers.addServiceableArea)
  .openapi(routes.getAllServiceableAreas, handlers.getAllServiceableAreas)
  .openapi(routes.getServiceableAreaById, handlers.getServiceableAreaById);

export default serviceableAreas;
