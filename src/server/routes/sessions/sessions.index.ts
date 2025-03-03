import * as routes from "./sessions.routes";
import * as handlers from "./sessions.handlers";
import { createOpenAPIRoute } from "@srms/server/openapi/createOpenApiRoute";

const sessions = createOpenAPIRoute().openapi(routes.setOdicParams, handlers.setOdicParams);

export default sessions;
