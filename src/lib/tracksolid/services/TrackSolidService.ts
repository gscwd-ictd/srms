import { env } from "process";
import { I_TrackSolidService } from "../interfaces";
import { TrackSolidAuth } from "../types";
import axios from "axios";
import { getDateTimeGMT0 } from "@srms/utils/dateTimeGMT0";
import { JimiMethods } from "@srms/utils/constants";
import { signMd5 } from "@srms/utils/signMd5";
import { IncorrectCredentialsError } from "../errors/InvalidRequestError";

export class TrackSolidService implements I_TrackSolidService {
  async getTsAccessToken(): Promise<TrackSolidAuth> {
    const fleetUrl = env.TRACKSOLID_URL;
    const appKey = env.TRACKSOLID_APP_KEY;
    const appSecret = env.TRACKSOLID_APP_SECRET;
    const usrMd5Pw = env.TRACKSOLID_PASSWORD;

    const dateTimeGMT0 = getDateTimeGMT0();
    const signString = `${appSecret}app_key${appKey}expires_in7200formatjsonmethod${JimiMethods.OAUTH}sign_methodmd5timestamp${dateTimeGMT0}user_idGENSANWDuser_pwd_md5${usrMd5Pw}v1.0${appSecret}`;

    const tsLoginBody = {
      app_key: appKey as string,
      expires_in: 7200,
      format: "json",
      method: JimiMethods.OAUTH,
      sign_method: "md5",
      sign: signMd5(signString),
      timestamp: dateTimeGMT0,
      user_id: "GENSANWD",
      user_pwd_md5: usrMd5Pw as string,
      v: "1.0",
    };

    const response = await axios.post<TrackSolidAuth>(`${fleetUrl}`, tsLoginBody, {
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
}
