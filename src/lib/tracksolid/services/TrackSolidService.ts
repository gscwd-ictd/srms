import { env } from "process";
import { I_TrackSolidService } from "../interfaces";
import { TrackSolidAuth } from "../types";
import axios from "axios";
import { getDateTimeGMT0 } from "@srms/utils/dateTimeGMT0";
import { JimiMethods } from "@srms/utils/constants";
import { signMd5 } from "@srms/utils/signMd5";
import { IncorrectCredentialsError } from "../errors/IncorrectCredentialsError";
import { InvalidTokenError } from "../errors/InvalidTokenError";
// import { setCookie } from "hono/cookie";

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
      console.log(response);
      throw new InvalidTokenError(`${response.data.message}`);
    }
  }
}
