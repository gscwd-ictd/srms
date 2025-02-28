export type MyCustomErrorCode = "invalid_request" | "unauthorized";

export type MyCustomErrorResponse = {
  code: MyCustomErrorCode;
  description?: string;
  status: number;
};
