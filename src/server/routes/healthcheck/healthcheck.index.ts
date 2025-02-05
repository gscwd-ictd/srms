import { createOpenAPIRoute } from "@nsa/server/helpers";
import * as routes from "./healthcheck.routes";
import * as handlers from "./healthcheck.handlers";

const healthcheck = createOpenAPIRoute().openapi(routes.getServerStatus, handlers.getServerStatus);

export default healthcheck;
