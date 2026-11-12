import { HTTPError } from "@srms/server/errors";
import { NOT_FOUND } from "@srms/utils/httpStatusCodes";

export class NotFoundError extends HTTPError {
  constructor(message: string) {
    super(NOT_FOUND, message, "NotFounError");
  }
}
