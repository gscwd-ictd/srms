import { trackSolidManager } from "@srms/server/app";
import { AppRouteHandler } from "@srms/server/types/appTypes";
import { GetTsAccessTokenRoute, GetTsRefreshTokenRoute } from "./trackSolid.routes";
import { z } from "zod";
import { SelectAccessTokenSchema, SelectRefreshTokenSchema } from "@srms/lib/tracksolid/schemas";

type AccessToken = z.infer<typeof SelectAccessTokenSchema>;
type RefreshToken = z.infer<typeof SelectRefreshTokenSchema>;

export const getTsAccessToken: AppRouteHandler<GetTsAccessTokenRoute> = async (c) => {
  const tsAccessToken = (await trackSolidManager.getTrackSolidService().getTsAccessToken()) as AccessToken;

  return c.json(tsAccessToken, 200);
};

export const getTsRefreshToken: AppRouteHandler<GetTsRefreshTokenRoute> = async (c) => {
  const accessToken = c.req.header("access-token") as string;
  const refreshToken = c.req.header("refresh-token") as string;

  const tsRefreshToken = (await trackSolidManager
    .getTrackSolidService()
    .getTsRefreshToken(accessToken, refreshToken)) as RefreshToken;

  return c.json(tsRefreshToken, 200);
};
