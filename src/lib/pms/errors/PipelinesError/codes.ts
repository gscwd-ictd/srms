export type PipelinesErrorCode = "pipelines_does_not_exist";

export type PipelinesErrorResponse = {
  code: PipelinesErrorCode;
  description?: string;
  status: number;
};
