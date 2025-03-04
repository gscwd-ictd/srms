import { notFound, onError, pinoLogger } from "@srms/server/middlewares";
import { secureHeaders } from "hono/secure-headers";
import { healthcheck, applications, sessions, callback } from "@srms/server/routes";
import { createOpenAPIRoute } from "./openapi/createOpenApiRoute";
import { configureOpenApi } from "./openapi/configureOpenApi";
import { crossOrigin } from "./middlewares/cors";
import { OIDCClientProvider } from "@srms/lib/oidc/services/OOIDCClientProvider";
import { requestId } from "hono/request-id";
import env from "@srms/utils/env";

function createApp() {
  const app = createOpenAPIRoute().basePath("/api");

  configureOpenApi(app);

  app.notFound(notFound);
  app.onError(onError);

  app.use(secureHeaders());
  app.use(crossOrigin);
  app.use(requestId());
  app.use(pinoLogger());

  const routes = [healthcheck, applications, sessions, callback] as const;

  routes.forEach((route) => app.route("/", route));

  return app;
}

const app = createApp();

export default app;

export const $oidcClient = await OIDCClientProvider.getInstance({
  authorizationServerUrl: env.AUTHORIZATION_SERVER_URL,
  clientId: env.CLIENT_ID,
  clientSecret: env.CLIENT_SECRET,
  redirectUri: env.REDIRECT_URI,
  scope: "openid email",
  allowInsecure: true,
});
