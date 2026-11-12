export type HydrantErrorCode = "hydrant_does_not_exist";

export type HydrantErrorResponse = {
  code: HydrantErrorCode;
  description?: string;
  status: number;
};
