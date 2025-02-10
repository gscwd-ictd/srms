import { createOpenAPIRoute, configureOpenApi } from "@srms/lib/openapi";
import { notFound, onError, pinoLogger } from "@srms/server/middlewares";
import { secureHeaders } from "hono/secure-headers";
import { healthcheck, applications, serviceableAreas } from "@srms/server/routes";

function createApp() {
  const app = createOpenAPIRoute().basePath("/api");

  configureOpenApi(app);

  app.notFound(notFound);
  app.onError(onError);

  app.use(pinoLogger());
  app.use(secureHeaders());

  const routes = [healthcheck, applications, serviceableAreas] as const;

  routes.forEach((route) => app.route("/", route));

  return app;
}

const app = createApp();

export default app;
