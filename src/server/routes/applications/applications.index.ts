import { createOpenAPIRoute } from "@nsa/server/helpers/openapi";
import * as applicationRoutes from "./applications.routes";
import * as applicationHandlers from "./applications.handlers";

const applications = createOpenAPIRoute().openapi(
  applicationRoutes.createApplication,
  applicationHandlers.create,
);

export default applications;
