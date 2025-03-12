import { GetServerStatusRoute } from "./healthcheck.routes";
import { RouteHandler } from "@hono/zod-openapi";
import { checkHealth } from "@srms/server/helpers/checkHealth";
import { OK } from "@srms/utils/httpStatusCodes";

export const getServerStatus: RouteHandler<GetServerStatusRoute, never> = async (c) => {
  const healthStatus = await checkHealth();
  return c.json(healthStatus, OK);
};
