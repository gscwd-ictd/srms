import env from "@srms/utils/env";
import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";

export const crossOrigin = createMiddleware(async (c, next) => {
  const corsMiddleware = cors({
    origin: [
      env.NEXT_PUBLIC_APP_URL,
      "http://localhost:3000",
      "http://localhost:3001",
      "http://172.20.10.57:3000",
    ],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "User-Agent",
      "X-Response-Time",
      "Content-Length",
      "Access-Control-Allow-Headers",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers",
      "X-Requested-With",
      "Origin",
      "Accept",
      "RSC",
      "Next-Url",
      "Next-Router-State-Tree",
    ],
    allowMethods: ["POST", "GET", "PATCH", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  });

  return corsMiddleware(c, next);
});
