import { createOpenAPIRoute, configureOpenApi } from "@srms/lib/openapi";
import { notFound, onError, pinoLogger } from "@srms/server/middlewares";
import { secureHeaders } from "hono/secure-headers";
import { cors } from "hono/cors";
import { healthcheck, applications, serviceableAreas } from "@srms/server/routes";

function createApp() {
  const app = createOpenAPIRoute().basePath("/api");

  configureOpenApi(app);

  app.notFound(notFound);
  app.onError(onError);

  app.use(pinoLogger());
  app.use(secureHeaders());

  // TODO: create separate file for this and handle dynamic origins
  app.use(
    cors({
      origin: ["http://172.20.10.57:3000"],
      allowHeaders: ["Content-Type", "Authorization", "User-Agent", "X-Response-Time", "Content-Length"],
      allowMethods: ["POST", "GET", "PATCH", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
    }),
  );

  const routes = [healthcheck, applications, serviceableAreas] as const;

  routes.forEach((route) => app.route("/", route));

  return app;
}

const app = createApp();

export default app;
