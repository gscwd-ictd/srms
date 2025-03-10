import { notFound, onError, pinoLogger } from "@srms/server/middlewares";
import { secureHeaders } from "hono/secure-headers";
import { healthcheck, applications } from "@srms/server/routes";
import { createOpenAPIRoute } from "./openapi/createOpenApiRoute";
import { configureOpenApi } from "./openapi/configureOpenApi";
import { crossOrigin } from "./middlewares/cors";
import { requestId } from "hono/request-id";

function createApp() {
  const app = createOpenAPIRoute().basePath("/api");

  configureOpenApi(app);

  app.notFound(notFound);
  app.onError(onError);

  app.use(secureHeaders());
  app.use(crossOrigin);
  app.use(requestId());
  app.use(pinoLogger());

  const routes = [healthcheck, applications] as const;

  routes.forEach((route) => app.route("/", route));

  return app;
}

const app = createApp();

export default app;
