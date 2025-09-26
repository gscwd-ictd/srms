import { LoggersError } from "./LoggersError";

export class LoggerChannelEntriesDoesNotExistError extends LoggersError {
  constructor(description: string) {
    super("logger_channel_entries_does_not_exist", description, 400);
    this.name = this.constructor.name;
  }
}
