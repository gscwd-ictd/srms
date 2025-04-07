/* import { ContentfulStatusCode } from "hono/utils/http-status";  */

export type CustomErrorCode = "not_found";

export type CustomErrorResponse = {
  code: CustomErrorCode;
  description?: string;
  timestamp?: string;
  status: number;
};

export class CustomError extends Error {
  constructor(
    public readonly code: CustomErrorCode,
    public readonly description?: string,
    public readonly status: number = 400,
  ) {
    super(description || code);

    this.name = "CustomError";
  }

  toJSON(): CustomErrorResponse {
    const errorResponse: CustomErrorResponse = {
      code: this.code,
      status: this.status,
      description: this.description,
      timestamp: new Date().toISOString(),
    };

    if (this.description) {
      errorResponse.description = this.description;
    }

    return errorResponse;
  }
}

export class NotFoundError extends CustomError {
  constructor(description?: string) {
    super("not_found", description);
    this.name = "NotFoundError";
  }
}
