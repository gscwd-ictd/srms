import {
  DeviceImei,
  DeviceImeis,
  TrackSolidAuth,
  TrackSolidDevice,
  TrackSolidDeviceDetail,
  TrackSolidDeviceLocation,
} from "../../types";

export interface I_TrackSolidService {
  getTsAccessToken(): Promise<TrackSolidAuth>;
  getTsRefreshToken(accessToken: string, refreshToken: string): Promise<TrackSolidAuth>;
  getDevices(accessToken: string): Promise<Array<TrackSolidDevice>>;
  getDeviceDetail(accessToken: string, data: DeviceImei): Promise<TrackSolidDeviceDetail>;
  getDevicesLocation(accessToken: string, data: DeviceImeis): Promise<Array<TrackSolidDeviceLocation>>;
}
