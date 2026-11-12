export type WaterMetersErrorCode = "water_meters_does_not_exist";

export type WaterMetersErrorResponse = {
  code: WaterMetersErrorCode;
  description?: string;
  status: number;
};
