export type ValvesErrorCode = "valves_does_not_exist";

export type ValvesErrorResponse = {
  code: ValvesErrorCode;
  description?: string;
  status: number;
};
