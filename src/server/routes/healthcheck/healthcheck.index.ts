import * as routes from "./healthcheck.routes";
import * as handlers from "./healthcheck.handlers";
import { createOpenAPIRoute } from "@srms/server/openapi";

const healthcheck = createOpenAPIRoute().openapi(routes.getServerStatus, handlers.getServerStatus);

export default healthcheck;
