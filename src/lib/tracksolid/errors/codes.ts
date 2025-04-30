export type TrackSolidErrorCode =
  | "incorrect_credentials"
  | "invalid_token"
  | "nonexistent_account"
  | "nonexistent_device"
  | "illegal_device";

export type TrackSolidErrorResponse = {
  code: TrackSolidErrorCode;
  description?: string;
  status: number;
};
