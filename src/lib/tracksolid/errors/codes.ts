export type TrackSolidErrorCode = "incorrect_credentials";

export type TrackSolidErrorResponse = {
  code: TrackSolidErrorCode;
  description?: string;
  status: number;
};
