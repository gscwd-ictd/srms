import { LoggerChannelEntry, LoggerDetails, LoggerFilterBody, MultilogBody } from "../../types";

export interface I_LoggersService {
  getXilogLoggersList(): Promise<Array<LoggerDetails>>;
  getXilogLoggerChannelEntries(body: LoggerFilterBody): Promise<LoggerChannelEntry>;
  getXilogChannelLatestEntries(serialNumber: string, channel: string): Promise<LoggerChannelEntry>;
  getMultilogLoggersList(): Promise<MultilogBody>;
}
