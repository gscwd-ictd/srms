import { env } from "process";
import { I_TrackSolidService } from "../interfaces";
import {
  DeviceImeis,
  DeviceMileage,
  TrackSolidAuth,
  TrackSolidDevice,
  TrackSolidDeviceDetail,
  TrackSolidDeviceList,
  TrackSolidDeviceLocation,
  TrackSolidDeviceLocationList,
  TrackSolidDeviceMileage,
  TrackSolidDeviceMileageList,
  TrackSolidRequestBody,
} from "../types";
import axios from "axios";
import { getDateTimeGMT0 } from "@srms/utils/dateTimeGMT0";
import { JimiMethods } from "@srms/utils/constants";
import { signMd5 } from "@srms/utils/signMd5";
import { IncorrectCredentialsError } from "../errors/IncorrectCredentialsError";
import { InvalidTokenError } from "../errors/InvalidTokenError";
import { NonexistentAccountError } from "../errors/NonexistentAccountError";
import { NonExistentDeviceError } from "../errors/NonExistentDeviceError";
import { IllegalDeviceError } from "../errors/IllegalDeviceError";
import { MissingParameterError } from "../errors/MissingParameterError";
import { sortObjectByKey } from "@srms/utils/sortObjectByKey";

export class TrackSolidService implements I_TrackSolidService {
  async getTsAccessToken(): Promise<TrackSolidAuth> {
    const fleetUrl = env.TRACKSOLID_URL;
    const appKey = env.TRACKSOLID_APP_KEY;
    const appSecret = env.TRACKSOLID_APP_SECRET;
    const userId = env.TRACKSOLID_USER;
    const usrMd5Pw = env.TRACKSOLID_PASSWORD;

    const dateTimeGMT0 = getDateTimeGMT0();
    const signString = `${appSecret}app_key${appKey}expires_in7200formatjsonmethod${JimiMethods.OAUTH}sign_methodmd5timestamp${dateTimeGMT0}user_id${userId}user_pwd_md5${usrMd5Pw}v1.0${appSecret}`;

    const body = {
      app_key: appKey as string,
      expires_in: 7200,
      format: "json",
      method: JimiMethods.OAUTH,
      sign_method: "md5",
      sign: signMd5(signString),
      timestamp: dateTimeGMT0,
      user_id: userId as string,
      user_pwd_md5: usrMd5Pw as string,
      v: "1.0",
    };

    const response = await axios.post<TrackSolidAuth>(`${fleetUrl}`, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // 0: return correctly
    if (response.data.code === 0) {
      return response.data;
    } else {
      throw new IncorrectCredentialsError(`${response.data.message}`);
    }
  }

  async getTsRefreshToken(accessToken: string, refreshToken: string): Promise<TrackSolidAuth> {
    const fleetUrl = env.TRACKSOLID_URL;
    const appKey = env.TRACKSOLID_APP_KEY;
    const appSecret = env.TRACKSOLID_APP_SECRET;

    const dateTimeGMT0 = getDateTimeGMT0();
    const signString = `${appSecret}access_token${accessToken}app_key${appKey}expires_in7200formatjsonmethod${JimiMethods.REFRESH}refresh_token${refreshToken}sign_methodmd5timestamp${dateTimeGMT0}v1.0${appSecret}`;

    const body = {
      access_token: accessToken,
      app_key: appKey as string,
      expires_in: 7200,
      format: "json",
      method: JimiMethods.REFRESH,
      refresh_token: refreshToken,
      sign_method: "md5",
      sign: signMd5(signString),
      timestamp: dateTimeGMT0,
      v: "1.0",
    };

    const response = await axios.post<TrackSolidAuth>(`${fleetUrl}`, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // 0: return correctly
    if (response.data.code === 0) {
      return response.data;
    } else {
      throw new InvalidTokenError(`${response.data.message}`);
    }
  }

  async getDevices(accessToken: string): Promise<Array<TrackSolidDevice>> {
    const fleetUrl = env.TRACKSOLID_URL;
    const appKey = env.TRACKSOLID_APP_KEY;
    const appSecret = env.TRACKSOLID_APP_SECRET;
    const userId = env.TRACKSOLID_USER;

    const dateTimeGMT0 = getDateTimeGMT0();
    const signString = `${appSecret}access_token${accessToken}app_key${appKey}expires_in7200formatjsonmethod${JimiMethods.DEVICE}sign_methodmd5target${userId}timestamp${dateTimeGMT0}v1.0${appSecret}`;

    const body = {
      access_token: accessToken,
      app_key: appKey as string,
      expires_in: 7200,
      format: "json",
      method: JimiMethods.DEVICE,
      sign_method: "md5",
      sign: signMd5(signString),
      target: userId,
      timestamp: dateTimeGMT0,
      v: "1.0",
    };

    const response = await axios.post<TrackSolidDeviceList>(`${fleetUrl}`, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // 0: return correctly
    if (response.data.code === 0) {
      const deviceList = response.data.result;
      deviceList.forEach((vehicle) => (vehicle.visible = false));

      return deviceList;
    } else {
      throw new NonexistentAccountError(`${response.data.message}`);
    }
  }

  async getDeviceDetail(accessToken: string, data: DeviceMileage): Promise<TrackSolidDeviceDetail> {
    const fleetUrl = env.TRACKSOLID_URL;
    const appKey = env.TRACKSOLID_APP_KEY;
    const appSecret = env.TRACKSOLID_APP_SECRET;

    const dateTimeGMT0 = getDateTimeGMT0();
    const signString = `${appSecret}access_token${accessToken}app_key${appKey}expires_in7200formatjsonimei${data.imeis}method${JimiMethods.DETAIL}sign_methodmd5timestamp${dateTimeGMT0}v1.0${appSecret}`;

    const body = {
      access_token: accessToken,
      app_key: appKey as string,
      expires_in: 7200,
      format: "json",
      imei: data.imeis,
      method: JimiMethods.DETAIL,
      sign_method: "md5",
      sign: signMd5(signString),
      timestamp: dateTimeGMT0,
      v: "1.0",
    };

    const response = await axios.post<TrackSolidDeviceDetail>(`${fleetUrl}`, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // 0: return correctly
    if (response.data.code === 0) {
      const deviceMileageData = await this.getDevicesMileage(accessToken, data);

      let todaysMileage = 0;

      if (deviceMileageData && deviceMileageData.length > 0) {
        deviceMileageData.map((data) => {
          todaysMileage += parseInt(data.distance);
        });
      }

      const { result, ...rest } = response.data;
      return { ...rest, result: { ...result, todaysMileage } };
    } else {
      throw new NonExistentDeviceError(`${response.data.message}`);
    }
  }

  async getDevicesLocation(accessToken: string, data: DeviceImeis): Promise<Array<TrackSolidDeviceLocation>> {
    const fleetUrl = env.TRACKSOLID_URL;
    const appKey = env.TRACKSOLID_APP_KEY;
    const appSecret = env.TRACKSOLID_APP_SECRET;

    const dateTimeGMT0 = getDateTimeGMT0();
    const signString = `${appSecret}access_token${accessToken}app_key${appKey}expires_in7200formatjsonimeis${data.imeis}method${JimiMethods.LOCATION}sign_methodmd5timestamp${dateTimeGMT0}v1.0${appSecret}`;

    const body = {
      access_token: accessToken,
      app_key: appKey as string,
      expires_in: 7200,
      format: "json",
      imeis: data.imeis,
      method: JimiMethods.LOCATION,
      sign_method: "md5",
      sign: signMd5(signString),
      timestamp: dateTimeGMT0,
      v: "1.0",
    };

    const response = await axios.post<TrackSolidDeviceLocationList>(`${fleetUrl}`, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // 0: return correctly
    if (response.data.code === 0) {
      const devicesLocationList = response.data.result;

      return devicesLocationList;
    } else {
      throw new IllegalDeviceError(`${response.data.message}`);
    }
  }

  async getDevicesMileage(accessToken: string, data: DeviceMileage): Promise<Array<TrackSolidDeviceMileage>> {
    const fleetUrl = env.TRACKSOLID_URL;
    const appKey = env.TRACKSOLID_APP_KEY;
    const appSecret = env.TRACKSOLID_APP_SECRET;

    const dateTimeGMT0 = getDateTimeGMT0();

    const signString =
      `${appSecret}access_token${accessToken}app_key${appKey}begin_time${data.beginTime}end_time${data.endTime}expires_in7200formatjsonimeis${data.imeis}method${JimiMethods.MILEAGE}` +
      `${data.pageSize && data.pageSize > 0 ? `page_size${data.pageSize}` : ""}` +
      `sign_methodmd5` +
      `${data.startRow && data.startRow > 0 ? `start_row${data.startRow}` : ""}` +
      `timestamp${dateTimeGMT0}v1.0${appSecret}`;

    const body: TrackSolidRequestBody = {
      access_token: accessToken,
      app_key: appKey as string,
      begin_time: data.beginTime,
      end_time: data.endTime,
      expires_in: 7200,
      format: "json",
      imeis: data.imeis,
      method: JimiMethods.MILEAGE,
      sign: signMd5(signString),
      sign_method: "md5",
      timestamp: dateTimeGMT0,
      v: "1.0",
    };

    if (data.pageSize && data.pageSize > 0) {
      Object.assign(body, { page_size: data.pageSize });
    }

    if (data.startRow && data.startRow > 0) {
      Object.assign(body, { start_row: data.startRow });
    }

    const response = await axios.post<TrackSolidDeviceMileageList>(`${fleetUrl}`, sortObjectByKey(body), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // 0: return correctly
    if (response.data.code === 0) {
      const devicesMileageList = response.data.result;

      return devicesMileageList;
    } else {
      if (response.data.code === 1001) {
        throw new MissingParameterError(`${response.data.message}`);
      } else {
        throw new IllegalDeviceError(`${response.data.message}`);
      }
    }
  }
}
