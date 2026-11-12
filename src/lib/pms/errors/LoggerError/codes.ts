export type LoggersErrorCode = "loggers_does_not_exist" | "logger_channel_entries_does_not_exist";

export type LoggersErrorResponse = {
  code: LoggersErrorCode;
  description?: string;
  status: number;
};
