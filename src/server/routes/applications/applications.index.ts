import { createOpenAPIRoute } from "@nsa/server/helpers/openapi";
import * as routes from "@nsa/server/routes/applications/applications.routes";
import * as handlers from "@nsa/server/routes/applications/applications.handlers";

const applications = createOpenAPIRoute()
  .openapi(routes.createNewApplication, handlers.createNewApplication)
  .openapi(routes.getApplicationDetailsById, handlers.getApplicationDetailsById)
  .openapi(routes.getAllApplicationDetails, handlers.getAllApplications);

export default applications;
