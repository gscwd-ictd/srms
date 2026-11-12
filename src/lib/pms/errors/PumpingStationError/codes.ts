export type PumpingStationErrorCode = "pumpingstation_does_not_exist";

export type PumpingStationErrorResponse = {
  code: PumpingStationErrorCode;
  description?: string;
  status: number;
};
