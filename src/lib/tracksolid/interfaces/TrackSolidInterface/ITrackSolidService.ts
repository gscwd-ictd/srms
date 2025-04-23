import { TrackSolidAuth } from "../../types";

export interface I_TrackSolidService {
  getTsAccessToken(): Promise<TrackSolidAuth>;
  getTsRefreshToken(accessToken: string, refreshToken: string): Promise<TrackSolidAuth>;
}
