import * as routes from "@srms/server/routes/applications/applications.routes";
import * as handlers from "@srms/server/routes/applications/applications.handlers";
import { createOpenAPIRoute } from "@srms/server/openapi";

const applications = createOpenAPIRoute()
  .openapi(routes.createNewApplication, handlers.createNewApplication)
  .openapi(routes.getApplicationDetailsById, handlers.getApplicationDetailsById)
  .openapi(routes.getAllApplicationDetails, handlers.getAllApplicationDetails)
  .openapi(routes.updateApplicationStatus, handlers.updateApplicationStatus);

export default applications;
