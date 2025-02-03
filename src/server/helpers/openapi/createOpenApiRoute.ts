import { OpenAPIHono } from "@hono/zod-openapi";
import { AppBindings } from "@nsa/server/helpers/types";
import { defaultHook } from "@nsa/server/helpers/openapi/openApiDefaultHook";

export function createOpenAPIRoute() {
  return new OpenAPIHono<AppBindings>({
    defaultHook,
  });
}
