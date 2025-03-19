import * as routes from "./applications.routes";
import * as handlers from "./applications.handlers";
import { createOpenAPIRoute } from "@srms/server/openapi/createOpenApiRoute";

const applications = createOpenAPIRoute()
  .openapi(routes.createNewApplication, handlers.createNewApplication)
  .openapi(routes.getAllApplicationDetails, handlers.getAllApplicationDetails);

export default applications;
