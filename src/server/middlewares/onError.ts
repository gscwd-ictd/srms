import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { AppBindings, ErrorResponse } from "@srms/server/types";
import { jsonError } from "@srms/server/errors";
import { INTERNAL_SERVER_ERROR, OK } from "@srms/server/constants";

export const onError: ErrorHandler<AppBindings> = (err, c) => {
  const currentStatus = "status" in err ? err.status : c.newResponse(null).status;

  const statusCode = currentStatus !== OK ? (currentStatus as ContentfulStatusCode) : INTERNAL_SERVER_ERROR;

  const errorResponse: ErrorResponse = {
    name: err.name,
    status: statusCode,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  };

  // Add other instances of error here...
  if (err.message === "Malformed JSON in request body") {
    return jsonError(c, { ...errorResponse, name: "InvalidJSONError" }, statusCode);
  }

  // Optionally, if description is available, append it to the errorReponse object
  if ("description" in err && typeof err.description === "string") {
    errorResponse.description = err.description;
  }

  return jsonError(c, errorResponse, statusCode);
};
