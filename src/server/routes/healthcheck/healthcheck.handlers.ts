import { GetServerStatusRoute } from "./healthcheck.routes";
import { OK } from "@nsa/server/constants";
import { RouteHandler } from "@hono/zod-openapi";
import { checkHealth } from "@nsa/server/helpers";

export const getServerStatus: RouteHandler<GetServerStatusRoute, never> = async (c) => {
  const healthStatus = await checkHealth();

  return c.json(healthStatus, OK);
};
