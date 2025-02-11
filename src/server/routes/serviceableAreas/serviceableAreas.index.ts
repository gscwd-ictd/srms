import * as routes from "./serviceableAreas.routes";
import * as handlers from "./serviceableAreas.handlers";
import { createOpenAPIRoute } from "@srms/lib/openapi";

const serviceableAreas = createOpenAPIRoute()
  .openapi(routes.createNewServiceableArea, handlers.createNewServiceableArea)
  .openapi(routes.getServiceableAreaById, handlers.getServiceableAreaById)
  .openapi(routes.getAllServiceableAreas, handlers.getAllServiceableAreas);

export default serviceableAreas;
