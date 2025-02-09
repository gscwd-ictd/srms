import { NOT_FOUND } from "@srms/server/constants";
import { HTTPError } from "@srms/server/errors";

export class NotFoundError extends HTTPError {
  constructor(message: string) {
    super(NOT_FOUND, message, "NotFounError");
  }
}
