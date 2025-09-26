import { LoggerChannelEntries, LoggerChannelEntry, LoggerDetails, LoggersList } from "../types";
import { I_LoggersService } from "../interfaces";
import axios from "axios";
import env from "@srms/utils/env";
import { isEmpty } from "@srms/utils/isEmpty";
import { LoggersDoesNotExistError } from "../errors/LoggerError/LoggersDoesNotExistError";
import { LoggerChannelEntriesDoesNotExistError } from "../errors/LoggerError/LoggerChannelEntriesDoesNotExistError";

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
    const response = await axios.get<LoggersList>(urlString, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    if (!isEmpty((response.data.status = 200))) {
      return response?.data?.data;
    } else {
      throw new LoggersDoesNotExistError(
        `Returned status: ${response.data.status} | statusText: ${response.data.statusText}`,
      );
    }
  }

  async getLoggerChannelEntries(
    serialNumber: string,
    channel: string,
    startDateTime: string,
    endDateTime: string,
  ): Promise<LoggerChannelEntry> {
    const xilogToken = env.XILOG_ACCESS_TOKEN;

    const urlString = `https://xilogdataapi.atriumiot.com/PlusData/${serialNumber}/${channel}/${startDateTime}/${endDateTime}/${xilogToken}`;

    // added username and password in case URL is changed to cloud.
    const response = await axios.get<LoggerChannelEntries>(urlString, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    if (!isEmpty((response.data.status = 200))) {
      return response.data.data;
    } else {
      throw new LoggerChannelEntriesDoesNotExistError(
        `Returned status: ${response.data.status} | statusText: ${response.data.statusText}`,
      );
    }
  }
}
