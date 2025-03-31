import { notFound, onError, pinoLogger } from "@srms/server/middlewares";
import { secureHeaders } from "hono/secure-headers";
import { healthcheck, applications, plumbingFixtures, serviceableArea } from "@srms/server/routes";
import { createOpenAPIRoute } from "./openapi/createOpenApiRoute";
import { configureOpenApi } from "./openapi/configureOpenApi";
import { crossOrigin } from "./middlewares/cors";
import { MinioManager } from "@srms/lib/minio";
import env from "@srms/utils/env";
import { NSAManager } from "@srms/lib/nsa/nsaManager";

function createApp() {
  const app = createOpenAPIRoute().basePath("/api");

  configureOpenApi(app);

  app.notFound(notFound);
  app.onError(onError);

  app.use(pinoLogger());
  app.use(secureHeaders());
  app.use(crossOrigin);

  const routes = [healthcheck, applications, plumbingFixtures, serviceableArea] as const;

  routes.forEach((route) => app.route("/", route));

  return app;
}

const app = createApp();

export default app;

export const minioManager = MinioManager.getInstance({
  endPoint: env.MINIO_ENDPOINT,
  port: env.MINIO_PORT,
  useSSL: false,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET,
});

export const nsaManager = NSAManager.getInstance();
