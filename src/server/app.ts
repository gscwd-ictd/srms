import { createOpenAPIRoute, configureOpenApi } from "@srms/lib/openapi";
import { notFound, onError, pinoLogger } from "@srms/server/middlewares";
import { secureHeaders } from "hono/secure-headers";
import { cors } from "hono/cors";
import { healthcheck, applications, serviceableAreas, plumbingFixtures } from "@srms/server/routes";
import env from "@srms/utils/env";

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
      origin: [
        env.NEXT_PUBLIC_APP_URL,
        "http://localhost:3000",
        "http://172.20.10.57:3000",
        "http://172.20.10.63:3000",
      ],
      allowHeaders: ["Content-Type", "Authorization", "User-Agent", "X-Response-Time", "Content-Length"],
      allowMethods: ["POST", "GET", "PATCH", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
    }),
  );

  const routes = [healthcheck, applications, serviceableAreas, plumbingFixtures] as const;

  routes.forEach((route) => app.route("/", route));

  return app;
}

const app = createApp();

export default app;
