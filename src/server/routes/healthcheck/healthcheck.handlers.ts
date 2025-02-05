import { GetServerStatusRoute } from "./healthcheck.routes";
import { OK } from "@nsa/server/constants";
import { RouteHandler } from "@hono/zod-openapi";

export const getServerStatus: RouteHandler<GetServerStatusRoute, never> = async (c) => {
  return c.json({ message: "Ok", status: OK, timestamp: new Date().toISOString() }, OK);
};
