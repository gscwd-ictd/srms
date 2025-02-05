import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHook } from "@nsa/server/helpers/openapi/openApiDefaultHook";
import { type AppBindings } from "@nsa/server/types";

export function createOpenAPIRoute() {
  return new OpenAPIHono<AppBindings>({
    defaultHook,
  });
}
