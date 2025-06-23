import { notFound, onError } from "@srms/server/middlewares";
import { secureHeaders } from "hono/secure-headers";
import {
  healthcheck,
  applications,
  plumbingFixtures,
  fixtureUnits,
  geoserver,
  serviceableAreas,
  trackSolid,
  pms,
} from "@srms/server/routes";
import { createOpenAPIRoute } from "./openapi/createOpenApiRoute";
import { configureOpenApi } from "./openapi/configureOpenApi";
import { crossOrigin } from "./middlewares/cors";
import env from "@srms/utils/env";
import multer from "multer";
import { MinioManager } from "@srms/lib/minio";
import { NSAManager } from "@srms/lib/nsa/nsaManager";
import { GeoServerManager } from "@srms/lib/geoserver/geoServerManager";
import { TrackSolidManager } from "@srms/lib/tracksolid/trackSolidManager";
import { PmsManager } from "@srms/lib/pms/pmsManager";

function createApp() {
  const app = createOpenAPIRoute().basePath("/api");

  configureOpenApi(app);

  app.notFound(notFound);
  app.onError(onError);

  app.use(secureHeaders());
  app.use(crossOrigin);

  // IMPORTANT! Add each route to this array
  const routes = [
    healthcheck,
    applications,
    plumbingFixtures,
    fixtureUnits,
    geoserver,
    trackSolid,
    serviceableAreas,
    pms,
  ] as const;
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

export const geoServerManager = GeoServerManager.getInstance();

export const trackSolidManager = TrackSolidManager.getInstance();

export const pmsManager = PmsManager.getInstance();
