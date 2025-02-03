import { createOpenAPIRoute, configureOpenApi } from "@nsa/server/helpers/openapi";
import { notFound, onError, pinoLogger } from "@nsa/server/middlewares";
import { secureHeaders } from "hono/secure-headers";
import healthcheck from "@nsa/server/routes/healthcheck";
import applications from "@nsa/server/routes/applications/applications.index";

function createApp() {
  const app = createOpenAPIRoute().basePath("/api");

  app.notFound(notFound);
  app.onError(onError);

  app.use(pinoLogger());
  app.use(secureHeaders());

  configureOpenApi(app);

  const routes = [healthcheck, applications] as const;

  routes.forEach((route) => app.route("/", route));

  return app;
}

const app = createApp();

export default app;
