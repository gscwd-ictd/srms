import { LoggersError } from "./LoggersError";

export class LoggersDoesNotExistError extends LoggersError {
  constructor(description: string) {
    super("loggers_does_not_exist", description, 400);
    this.name = this.constructor.name;
  }
}
