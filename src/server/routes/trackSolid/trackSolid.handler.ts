import { trackSolidManager } from "@srms/server/app";
import { AppRouteHandler } from "@srms/server/types/appTypes";
import { GetTrackSolidRoute } from "./trackSolid.routes";

export const getTsAccessToken: AppRouteHandler<GetTrackSolidRoute> = async (c) => {
  const tsAccessToken = await trackSolidManager.getTrackSolidService().getTsAccessToken();
  return c.json(tsAccessToken, 200);
};
