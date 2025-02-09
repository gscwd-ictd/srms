import { GetServerStatusRoute } from "./healthcheck.routes";
import { OK } from "@srms/server/constants";
import { RouteHandler } from "@hono/zod-openapi";
import { checkHealth } from "@srms/server/helpers";

export const getServerStatus: RouteHandler<GetServerStatusRoute, never> = async (c) => {
  const healthStatus = await checkHealth();

  return c.json(healthStatus, OK);
};
