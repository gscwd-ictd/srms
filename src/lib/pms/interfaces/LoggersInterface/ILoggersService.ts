import { LoggerChannelEntry, LoggerDetails, LoggerFilterBody } from "../../types";

export interface I_LoggersService {
  getLoggersList(): Promise<Array<LoggerDetails>>;
  getLoggerChannelEntries(body: LoggerFilterBody): Promise<LoggerChannelEntry>;
}
