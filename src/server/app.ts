import { secureHeaders } from 'hono/secure-headers';
import { healthcheck } from '@srms/server/routes';
import { createOpenAPIRoute } from './openapi/createOpenApiRoute';
import { configureOpenApi } from './openapi/configureOpenApi';
import { crossOrigin } from './middlewares/cors';
import { requestId } from 'hono/request-id';
import { onError } from './middlewares/onError';
import { notFound } from './middlewares/notFound';
import { pinoLogger } from './middlewares/pinoLogger';

function createApp() {
  const app = createOpenAPIRoute().basePath('/api');

  configureOpenApi(app);

  app.notFound(notFound);
  app.onError(onError);

  app.use(secureHeaders());
  app.use(crossOrigin);
  app.use(requestId());
  app.use(pinoLogger());

  const routes = [healthcheck] as const;

  routes.forEach(route => app.route('/', route));

  return app;
}

const app = createApp();

export default app;
