import { secureHeaders } from "hono/secure-headers";
import { healthcheck, applications, plumbingFixtures, fixtureUnits } from "@srms/server/routes";
import { createOpenAPIRoute } from "./openapi/createOpenApiRoute";
import { configureOpenApi } from "./openapi/configureOpenApi";
import { crossOrigin } from "./middlewares/cors";
<<<<<<< HEAD
import { requestId } from "hono/request-id";
import { onError } from "./middlewares/onError";
import { notFound } from "./middlewares/notFound";
import { pinoLogger } from "./middlewares/pinoLogger";
=======
import { MinioManager } from "@srms/lib/minio";
import env from "@srms/utils/env";
import { NSAManager } from "@srms/lib/nsa/nsaManager";
import multer from "multer";
>>>>>>> 13b7ffe712f0e6b7d95b71cae686e8b5a58e6b00

function createApp() {
  const app = createOpenAPIRoute().basePath("/api");

  configureOpenApi(app);

  app.notFound(notFound);
  app.onError(onError);

  app.use(secureHeaders());
  app.use(crossOrigin);
<<<<<<< HEAD
  app.use(requestId());
  app.use(pinoLogger());

  const routes = [healthcheck, applications] as const;

=======
  const routes = [healthcheck, applications, plumbingFixtures, fixtureUnits] as const;
>>>>>>> 13b7ffe712f0e6b7d95b71cae686e8b5a58e6b00
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

export const upload = multer({ storage: multer.memoryStorage() });
export const nsaManager = NSAManager.getInstance();
