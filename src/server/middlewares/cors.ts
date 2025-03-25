import env from "@srms/utils/env";
import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";

export const crossOrigin = createMiddleware(async (c, next) => {
  const corsMiddleware = cors({
<<<<<<< HEAD
    origin: [env.NEXT_PUBLIC_APP_URL],
    allowHeaders: [
      "Access-Control-Request-Headers",
      "Access-Control-Request-Method",
      "Access-Control-Allow-Headers",
      "Next-Router-State-Tree",
      "X-Requested-With",
      "X-Response-Time",
      "Content-Length",
      "Authorization",
      "Content-Type",
      "User-Agent",
      "Next-Url",
      "Origin",
      "Accept",
      "RSC",
    ],
=======
    origin: [
      env.NEXT_PUBLIC_APP_URL,
      "http://localhost:3000",
      "http://172.20.10.57:3000",
      "http://172.20.10.63:3000",
    ],
    allowHeaders: ["Content-Type", "Authorization", "User-Agent", "X-Response-Time", "Content-Length"],
>>>>>>> 13b7ffe712f0e6b7d95b71cae686e8b5a58e6b00
    allowMethods: ["POST", "GET", "PATCH", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  });

  return corsMiddleware(c, next);
});
