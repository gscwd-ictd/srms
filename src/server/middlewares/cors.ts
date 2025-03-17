import env from '@srms/utils/env';
import { cors } from 'hono/cors';
import { createMiddleware } from 'hono/factory';

export const crossOrigin = createMiddleware(async (c, next) => {
  const corsMiddleware = cors({
    origin: [env.NEXT_PUBLIC_APP_URL],
    allowHeaders: [
      'Access-Control-Request-Headers',
      'Access-Control-Request-Method',
      'Access-Control-Allow-Headers',
      'Next-Router-State-Tree',
      'X-Requested-With',
      'X-Response-Time',
      'Content-Length',
      'Authorization',
      'Content-Type',
      'User-Agent',
      'Next-Url',
      'Origin',
      'Accept',
      'RSC',
    ],
    allowMethods: ['POST', 'GET', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  return corsMiddleware(c, next);
});
