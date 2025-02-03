import { OpenAPIHono, RouteConfig, RouteHandler, z } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";
import type { ErrorResponseSchema } from "@nsa/server/helpers/errors/jsonError";

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppBindings = {
  Variables: {
    logger: PinoLogger;
  };
};

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>;

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
