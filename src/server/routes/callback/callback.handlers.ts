import { AppRouteHandler } from "@srms/server/types/appTypes";
import { CallbackRoute } from "./callback.routes";

// @ts-expect-error not yet fully implemented
export const callback: AppRouteHandler<CallbackRoute> = async (c) => {
  return c.json({ status: "ok" });
};
