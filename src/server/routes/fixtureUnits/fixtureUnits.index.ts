import * as routes from "./fixtureUnits.routes";
import * as handlers from "./fixtureUnits.handler";
import { createOpenAPIRoute } from "@srms/server/openapi/createOpenApiRoute";

const fixtureUnits = createOpenAPIRoute()
  .openapi(routes.getFixtureUnitsByYear, handlers.getFixtureUnitsByYear)
  .openapi(routes.addFixtureUnit, handlers.addFixtureUnit);
export default fixtureUnits;
