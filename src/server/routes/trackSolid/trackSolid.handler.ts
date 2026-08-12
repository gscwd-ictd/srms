import { trackSolidManager } from "@srms/server/app";
import { AppRouteHandler } from "@srms/server/types/appTypes";
import {
  GetDeviceDetailRoute,
  GetDevicesLocationRoute,
  GetDevicesMileageRoute,
  GetDevicesRoute,
  GetTsAccessTokenRoute,
  GetTsRefreshTokenRoute,
} from "./trackSolid.routes";
import { z } from "zod";
import {
  SelectAccessTokenSchema,
  SelectRefreshTokenSchema,
  SelectDeviceDetailSchema,
  SelectDevicesSchema,
  SelectDevicesLocationSchema,
  SelectDevicesMileageSchema,
  ErrorRefreshTokenSchema,
} from "@srms/lib/tracksolid/schemas";
import { setCookie, getCookie } from "hono/cookie";

type AccessToken = z.infer<typeof SelectAccessTokenSchema>;
type RefreshToken = z.infer<typeof SelectRefreshTokenSchema>;
type Devices = z.infer<typeof SelectDevicesSchema>;
type DeviceDetail = z.infer<typeof SelectDeviceDetailSchema>;
type DevicesLocation = z.infer<typeof SelectDevicesLocationSchema>;
type DevicesMileage = z.infer<typeof SelectDevicesMileageSchema>;

export const getTsAccessToken: AppRouteHandler<GetTsAccessTokenRoute> = async (c) => {
  const tsAccessToken = (await trackSolidManager.getTrackSolidService().getTsAccessToken()) as AccessToken;

  setCookie(c, "tsAccessToken", tsAccessToken.result.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 2, // 7200 seconds
  });

  setCookie(c, "tsRefreshToken", tsAccessToken.result.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return c.json(tsAccessToken, 200);
};

export const getTsRefreshToken: AppRouteHandler<GetTsRefreshTokenRoute> = async (c) => {
  // const accessToken = c.req.header("tsAccessToken") as string;
  // const refreshToken = c.req.header("tsRefreshToken") as string;

  const accessToken = getCookie(c, "tsAccessToken") as string;
  const refreshToken = getCookie(c, "tsRefreshToken") as string;

  if (!accessToken || !refreshToken) {
    return c.json(
      {
        error: true,
        message: "Missing Tracksolid authentication cookies.",
      },
      401,
    );
  }
  const tsRefreshToken = (await trackSolidManager
    .getTrackSolidService()
    .getTsRefreshToken(accessToken, refreshToken)) as RefreshToken;

  if (!tsRefreshToken?.result?.accessToken) {
    return c.json(
      {
        error: true,
        message: "Unable to refresh TrackSolid token.",
      },
      401,
    );
  }

  setCookie(c, "tsAccessToken", tsRefreshToken.result.accessToken, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 2,
  });

  setCookie(c, "tsRefreshToken", tsRefreshToken.result.refreshToken, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return c.json(tsRefreshToken, 200);
};

export const getDevices: AppRouteHandler<GetDevicesRoute> = async (c) => {
  const accessToken = c.req.header("access-token") as string;

  const devices = (await trackSolidManager.getTrackSolidService().getDevices(accessToken)) as Devices;

  return c.json(devices, 200);
};

export const getDeviceDetail: AppRouteHandler<GetDeviceDetailRoute> = async (c) => {
  const accessToken = c.req.header("access-token") as string;
  const body = c.req.valid("json");

  const deviceDetail = (await trackSolidManager
    .getTrackSolidService()
    .getDeviceDetail(accessToken, body)) as DeviceDetail;

  return c.json(deviceDetail, 200);
};

export const getDevicesLocation: AppRouteHandler<GetDevicesLocationRoute> = async (c) => {
  const accessToken = c.req.header("access-token") as string;
  const body = c.req.valid("json");

  const devicesLocation = (await trackSolidManager
    .getTrackSolidService()
    .getDevicesLocation(accessToken, body)) as DevicesLocation;

  return c.json(devicesLocation, 200);
};

export const getDevicesMileage: AppRouteHandler<GetDevicesMileageRoute> = async (c) => {
  const accessToken = c.req.header("access-token") as string;
  const body = c.req.valid("json");

  const devicesMileage = (await trackSolidManager
    .getTrackSolidService()
    .getDevicesMileage(accessToken, body)) as DevicesMileage;

  return c.json(devicesMileage, 200);
};
