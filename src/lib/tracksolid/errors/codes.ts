export type TrackSolidErrorCode = "incorrect_credentials" | "invalid_token";

export type TrackSolidErrorResponse = {
  code: TrackSolidErrorCode;
  description?: string;
  status: number;
};
