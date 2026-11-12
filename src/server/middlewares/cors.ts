import env from "@srms/utils/env";
import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";

export const crossOrigin = createMiddleware(async (c, next) => {
  const corsMiddleware = cors({
    origin: [
      env.NEXT_PUBLIC_APP_URL,
      "http://localhost:3000",
      "http://172.20.110.84:3000",
      "ws://172.20.110.84:7575",
      "http://172.20.10.60:3000",
      "http://172.20.10.57:3000",
    ],
    allowHeaders: ["Content-Type", "Authorization", "User-Agent", "X-Response-Time", "Content-Length"],
    allowMethods: ["POST", "GET", "PATCH", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  });

  return corsMiddleware(c, next);
});
