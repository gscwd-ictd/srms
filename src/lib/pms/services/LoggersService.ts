import { LoggerChannelEntry, LoggerDetails, LoggerFilterBody } from "../types";
import { I_LoggersService } from "../interfaces";
import axios from "axios";
import env from "@srms/utils/env";
import { LoggersDoesNotExistError } from "../errors/LoggerError/LoggersDoesNotExistError";
import { LoggerChannelEntriesDoesNotExistError } from "../errors/LoggerError/LoggerChannelEntriesDoesNotExistError";
import { isEmpty } from "@srms/utils/isEmpty";

export class LoggersService implements I_LoggersService {
  /**
   *
   * @param data Details about the valves.
   *
   * @returns
   */
  async getLoggersList(): Promise<Array<LoggerDetails>> {
    const xilogToken = env.XILOG_ACCESS_TOKEN;

    const urlString = `https://xilogdataapi.atriumiot.com/PlusLogger/All/${xilogToken}`;

    // added username and password in case URL is changed to cloud.
    const response = await axios.get<Array<LoggerDetails>>(urlString, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    if (!isEmpty(response.data)) {
      return response?.data;
    } else {
      throw new LoggersDoesNotExistError(`Returned number of loggers: ${response.data.length}`);
    }
  }

  async getLoggerChannelEntries(body: LoggerFilterBody): Promise<LoggerChannelEntry> {
    const xilogToken = env.XILOG_ACCESS_TOKEN;

    const urlString = `https://xilogdataapi.atriumiot.com/PlusData/${body.serialNumber}/${body.channel}/${body.startDateTime}/${body.endDateTime}/${xilogToken}`;

    console.log(urlString);

    // added username and password in case URL is changed to cloud.
    const response = await axios.get<LoggerChannelEntry>(urlString, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    if (!isEmpty(response.data)) {
      return response.data;
    } else {
      throw new LoggerChannelEntriesDoesNotExistError(
        `Returned number of entries: ${response.data?.data?.length} for channel ${response.data.channel.index}`,
      );
    }
  }
}
