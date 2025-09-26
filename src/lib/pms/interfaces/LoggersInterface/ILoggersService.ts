import { LoggerChannelEntry, LoggerDetails } from "../../types";

export interface I_LoggersService {
  getLoggersList(): Promise<Array<LoggerDetails>>;
  getLoggerChannelEntries(
    serialNumber: string,
    channel: string,
    startDateTime: string,
    endDateTime: string,
  ): Promise<LoggerChannelEntry>;
}
