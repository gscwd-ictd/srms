import { LoggerChannelEntry, LoggerDetails, LoggerFilterBody } from "../types";
import { I_LoggersService } from "../interfaces";
import axios from "axios";
import env from "@srms/utils/env";
import { LoggersDoesNotExistError } from "../errors/LoggerError/LoggersDoesNotExistError";
import { LoggerChannelEntriesDoesNotExistError } from "../errors/LoggerError/LoggerChannelEntriesDoesNotExistError";
import { isEmpty } from "@srms/utils/isEmpty";
import dayjs from "dayjs";

export class LoggersService implements I_LoggersService {
  /**
   *
   * @param data Details about the valves.
   *
   * @returns
   */
  async getXilogLoggersList(): Promise<Array<LoggerDetails>> {
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

  async getXilogLoggerChannelEntries(body: LoggerFilterBody): Promise<LoggerChannelEntry> {
    const xilogToken = env.XILOG_ACCESS_TOKEN;

    const urlString = `https://xilogdataapi.atriumiot.com/PlusData/${body.serialNumber}/${body.channel}/${body.startDateTime}/${body.endDateTime}/${xilogToken}`;

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

  async getXilogChannelLatestEntries(serialNumber: string, channel: string): Promise<LoggerChannelEntry> {
    const currentDateTime = dayjs().format("YYYY-MM-DD HH:mm");
    const prevDateTime = dayjs().subtract(12, "hour").format("YYYY-MM-DD HH:mm"); // previous 1 hour

    const body = {
      serialNumber: serialNumber,
      channel: channel,
      startDateTime: prevDateTime,
      endDateTime: currentDateTime,
    };

    const latestLoggerEntry = await this.getXilogLoggerChannelEntries(body);

    if (!isEmpty(latestLoggerEntry)) {
      return latestLoggerEntry;
    } else {
      throw new LoggerChannelEntriesDoesNotExistError(
        `Returned number of entries: ${latestLoggerEntry.data?.length} for channel ${latestLoggerEntry.channel.index}`,
      );
    }
  }
}
