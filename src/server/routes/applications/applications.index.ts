import { createOpenAPIRoute } from "@nsa/server/helpers/openapi";
import * as applicationRoutes from "@nsa/server/routes/applications/applications.routes";
import * as applicationHandlers from "@nsa/server/routes/applications/applications.handlers";

const applications = createOpenAPIRoute().openapi(applicationRoutes.create, applicationHandlers.create);

export default applications;
