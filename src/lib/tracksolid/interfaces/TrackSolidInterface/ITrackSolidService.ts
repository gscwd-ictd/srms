import {
  DeviceImeis,
  DeviceMileage,
  TrackSolidAuth,
  TrackSolidDevice,
  TrackSolidDeviceDetail,
  TrackSolidDeviceLocation,
  TrackSolidDeviceMileage,
} from "../../types";

export interface I_TrackSolidService {
  getTsAccessToken(): Promise<TrackSolidAuth>;
  getTsRefreshToken(accessToken: string, refreshToken: string): Promise<TrackSolidAuth>;
  getDevices(accessToken: string): Promise<Array<TrackSolidDevice>>;
  getDeviceDetail(accessToken: string, data: DeviceMileage): Promise<TrackSolidDeviceDetail>;
  getDevicesLocation(accessToken: string, data: DeviceImeis): Promise<Array<TrackSolidDeviceLocation>>;
  getDevicesMileage(accessToken: string, data: DeviceMileage): Promise<Array<TrackSolidDeviceMileage>>;
}
