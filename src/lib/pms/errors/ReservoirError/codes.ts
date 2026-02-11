export type ReservoirErrorCode = "reservoir_does_not_exist";

export type ReservoirErrorResponse = {
  code: ReservoirErrorCode;
  description?: string;
  status: number;
};
