import * as routes from "./auth.routes";
import * as handlers from "./auth.handler";
import { createOpenAPIRoute } from "@srms/server/openapi/createOpenApiRoute";

const authentication = createOpenAPIRoute().openapi(routes.getUserRoles, handlers.getUserRoles);

export default authentication;
