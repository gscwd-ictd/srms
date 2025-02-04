import { NOT_FOUND } from "@nsa/server/constants/httpStatusCodes";
import { HTTPError } from "./httpError";

export class NotFoundError extends HTTPError {
  constructor(message: string) {
    super(NOT_FOUND, message, "NotFounError", undefined);
  }
}
