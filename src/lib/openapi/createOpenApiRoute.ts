import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHook } from "@srms/lib/openapi/openApiDefaultHook";
import { type AppBindings } from "@srms/server/types";

export function createOpenAPIRoute() {
  return new OpenAPIHono<AppBindings>({
    defaultHook,
  });
}
