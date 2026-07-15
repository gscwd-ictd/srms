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
} from "@srms/lib/tracksolid/schemas";

type AccessToken = z.infer<typeof SelectAccessTokenSchema>;
type RefreshToken = z.infer<typeof SelectRefreshTokenSchema>;
type Devices = z.infer<typeof SelectDevicesSchema>;
type DeviceDetail = z.infer<typeof SelectDeviceDetailSchema>;
type DevicesLocation = z.infer<typeof SelectDevicesLocationSchema>;
type DevicesMileage = z.infer<typeof SelectDevicesMileageSchema>;

export const getTsAccessToken: AppRouteHandler<GetTsAccessTokenRoute> = async (c) => {
  const tsAccessToken = (await trackSolidManager.getTrackSolidService().getTsAccessToken()) as AccessToken;

  return c.json(tsAccessToken, 200);
};

export const getTsRefreshToken: AppRouteHandler<GetTsRefreshTokenRoute> = async (c) => {
  const accessToken = c.req.header("tsAccessToken") as string;
  const refreshToken = c.req.header("tsRefreshToken") as string;

  const tsRefreshToken = (await trackSolidManager
    .getTrackSolidService()
    .getTsRefreshToken(accessToken, refreshToken)) as RefreshToken;

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
