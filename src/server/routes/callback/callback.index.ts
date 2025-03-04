import * as routes from "./callback.routes";
import * as handlers from "./callback.handlers";
import { createOpenAPIRoute } from "@srms/server/openapi/createOpenApiRoute";

const callback = createOpenAPIRoute().openapi(routes.callback, handlers.callback);

export default callback;
