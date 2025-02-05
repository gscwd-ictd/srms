import { createOpenAPIRoute } from "@nsa/server/helpers";
import * as routes from "@nsa/server/routes/applications/applications.routes";
import * as handlers from "@nsa/server/routes/applications/applications.handlers";

const applications = createOpenAPIRoute()
  .openapi(routes.createNewApplication, handlers.createNewApplication)
  .openapi(routes.getApplicationDetailsById, handlers.getApplicationDetailsById)
  .openapi(routes.getAllApplicationDetails, handlers.getAllApplicationDetails)
  .openapi(routes.updateApplicationStatus, handlers.updateApplicationStatus);

export default applications;
