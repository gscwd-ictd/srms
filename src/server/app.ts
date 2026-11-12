import { notFound, onError } from "@srms/server/middlewares";
import { secureHeaders } from "hono/secure-headers";
import { geoserver, trackSolid, pms, waterMeters, tcms, authentication } from "@srms/server/routes";
import { createOpenAPIRoute } from "./openapi/createOpenApiRoute";
import { configureOpenApi } from "./openapi/configureOpenApi";
import { crossOrigin } from "./middlewares/cors";
import env from "@srms/utils/env";
import multer from "multer";
import { MinioManager } from "@srms/lib/minio";
import { GeoServerManager } from "@srms/lib/geoserver/geoServerManager";
import { TrackSolidManager } from "@srms/lib/tracksolid/trackSolidManager";
import { PmsManager } from "@srms/lib/pms/pmsManager";
import { WaterMetersManager } from "@srms/lib/watermeters/waterMetersManager";
import { TCMSManager } from "@srms/lib/tcms/tcmsManager";
import { AuthManager } from "@srms/lib/authentication/authManager";

function createApp() {
  const app = createOpenAPIRoute().basePath("/api");

  configureOpenApi(app);

  app.notFound(notFound);
  app.onError(onError);

  app.use(secureHeaders());
  app.use(crossOrigin);

  // IMPORTANT! Add each route to this array
  const routes = [geoserver, trackSolid, pms, waterMeters, tcms, authentication] as const;
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

export const geoServerManager = GeoServerManager.getInstance();

export const trackSolidManager = TrackSolidManager.getInstance();

export const pmsManager = PmsManager.getInstance();

export const waterMetersManager = WaterMetersManager.getInstance();

export const tcmsManager = TCMSManager.getInstance();

export const authManager = AuthManager.getInstance();
