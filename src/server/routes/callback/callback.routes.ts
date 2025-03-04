import { createRoute } from "@hono/zod-openapi";

export const callback = createRoute({
  tags: ["OIDC"],
  method: "get",
  path: "/callback",
  responses: {},
});

export type CallbackRoute = typeof callback;
