import * as routes from "./plumbingFixtures.routes";
import * as handlers from "./plumbingFixtures.handlers";
import { createOpenAPIRoute } from "@srms/server/openapi/createOpenApiRoute";

const plumbingFixtureRoute = createOpenAPIRoute()
  .openapi(routes.getAllPlumbingFixtures, handlers.getAllPlumbingFixtures)
  .openapi(routes.addPlumbingFixture, handlers.addPlumbingFixture)
  .openapi(routes.getPlumbingFixtureById, handlers.getPlumbingFixtureById)
  .openapi(routes.updatePlumbingFixtureById, handlers.updatePlumbingFixtureById)
  .openapi(routes.deletePlumbingFixtureById, handlers.deletePlumbingFixtureById);

export default plumbingFixtureRoute;
