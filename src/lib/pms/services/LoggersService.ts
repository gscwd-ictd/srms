import {
  LoggerChannelEntry,
  LoggerDetails,
  LoggerFilterBody,
  MultilogBody,
  MultilogChannel,
  MultilogLogger,
  MultilogLoggerBody,
  MultilogLoggerChannel,
} from "../types";
import { I_LoggersService } from "../interfaces";
import axios from "axios";
import env from "@srms/utils/env";
import { LoggersDoesNotExistError } from "../errors/LoggerError/LoggersDoesNotExistError";
import { LoggerChannelEntriesDoesNotExistError } from "../errors/LoggerError/LoggerChannelEntriesDoesNotExistError";
import { isEmpty } from "@srms/utils/isEmpty";
import dayjs from "dayjs";
import { convertXML } from "simple-xml-to-json";

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

  async getMultilogLoggersList(): Promise<Array<MultilogLogger>> {
    const urlString = `http://tze-innovations.com/datagate/api/loggerapi.ashx?username=gscwd-online&password=Iamattbellamia26.`;

    const responseXml = await axios.get<MultilogBody>(urlString, {
      headers: {
        "Content-Type": "application/xml",
        "Access-Control-Allow-Origin": "*",
      },
    });

    // Convert XML data to JSON
    const responseJson = convertXML(`${responseXml.data}`);

    // Start mutation of converted JSON
    const loggersArray = responseJson.loggers.children.splice(1);

    // Function to return value or empty string from object: {} or {content: ""}
    const processContent = (item: object | { content: string } | undefined) => {
      if (item !== undefined && "content" in item) {
        return `${item.content}`;
      } else {
        return "";
      }
    };

    const newArr1: Array<MultilogLogger> = [];
    loggersArray.map((logger: MultilogLoggerBody) => {
      // Level 2
      const newArr2: Array<MultilogChannel> = [];
      const channelArr = logger.logger?.children[35]?.channels;

      channelArr?.children.map((channel: MultilogLoggerChannel) => {
        const newObj2 = {
          channelName: processContent(channel.channel?.children[0]?.channelName),
          offset: processContent(channel.channel?.children[1]?.offset),
          flowPulseFactor: processContent(channel.channel?.children[2]?.flowPulseFactor),
          meterReadValue: processContent(channel.channel?.children[3]?.meterReadValue),
          meterReadDate: processContent(channel.channel?.children[4]?.meterReadDate),
          calvalue: processContent(channel.channel?.children[5]?.calvalue),
          loggercalvalue: processContent(channel.channel?.children[6]?.loggercalvalue),
          loggeroffset: processContent(channel.channel?.children[7]?.loggeroffset),
          ignoreloggervalues: processContent(channel.channel?.children[8]?.ignoreloggervalues),
          is4to20: processContent(channel.channel?.children[9]?.is4to20),
          loggerIs4to20: processContent(channel.channel?.children[10]?.loggerIs4to20),
          invertnegativevalues: processContent(channel.channel?.children[11]?.invertnegativevalues),
          lastValue: processContent(channel.channel?.children[12]?.lastValue),
          lastValueDate: processContent(channel.channel?.children[13]?.lastValueDate),
          measurement: {
            name: processContent(channel.channel?.children[14]?.measurement?.children[0]?.name),
            reference: processContent(channel.channel?.children[14]?.measurement?.children[1]?.reference),
            units: {
              symbols: processContent(
                channel.channel?.children[14]?.measurement?.children[2]?.units?.children[0]?.symbols,
              ),
            },
          },
        };

        newArr2.push(newObj2);
      });

      // Level 1
      const newObj1 = {
        loggerid: processContent(logger.logger?.children[0]?.loggerid),
        mobileNumber: processContent(logger.logger?.children[1]?.mobileNumber),
        dateLastMessageReceived: processContent(logger.logger?.children[2]?.dateLastMessageReceived),
        type: processContent(logger.logger?.children[3]?.type),
        serialNumber: processContent(logger.logger?.children[4]?.serialNumber),
        loggerOwner: processContent(logger.logger?.children[5]?.loggerOwner),
        LogRate: processContent(logger.logger?.children[6]?.LogRate),
        RST: processContent(logger.logger?.children[7]?.RST),
        RET: processContent(logger.logger?.children[8]?.RET),
        gsmDataNumber: processContent(logger.logger?.children[9]?.gsmDataNumber),
        notes: processContent(logger.logger?.children[10]?.notes),
        batteryCondition: processContent(logger.logger?.children[11]?.batteryCondition),
        signalStrength: processContent(logger.logger?.children[12]?.signalStrength),
        lastReportedVersion: processContent(logger.logger?.children[13]?.lastReportedVersion),
        dateCreated: processContent(logger.logger?.children[14]?.dateCreated),
        dateUpdated: processContent(logger.logger?.children[15]?.dateUpdated),
        heightAOD: processContent(logger.logger?.children[16]?.heightAOD),
        startDate: processContent(logger.logger?.children[17]?.startDate),
        endDate: processContent(logger.logger?.children[18]?.endDate),
        maintenanceflag: processContent(logger.logger?.children[19]?.maintenanceflag),
        id: processContent(logger.logger?.children[20]?.id),
        owner: processContent(logger.logger?.children[21]?.owner),
        siteId: processContent(logger.logger?.children[22]?.siteId),
        siteName: processContent(logger.logger?.children[23]?.siteName),
        SiteNotes: processContent(logger.logger?.children[24]?.SiteNotes),
        latitude: processContent(logger.logger?.children[25]?.latitude),
        longitude: processContent(logger.logger?.children[26]?.longitude),
        channel1Type: processContent(logger.logger?.children[27]?.channel1Type),
        flowPulseFactor1: processContent(logger.logger?.children[28]?.flowPulseFactor1),
        meterRead1Value: processContent(logger.logger?.children[29]?.meterRead1Value),
        meterRead1Date: processContent(logger.logger?.children[30]?.meterRead1Date),
        channel2Type: processContent(logger.logger?.children[31]?.channel2Type),
        flowPulseFactor2: processContent(logger.logger?.children[32]?.flowPulseFactor2),
        meterRead2Value: processContent(logger.logger?.children[33]?.meterRead2Value),
        meterRead2Date: processContent(logger.logger?.children[34]?.meterRead2Date),
        channels: newArr2,
      };

      return newArr1.push(newObj1);
    });

    if (!isEmpty(responseJson)) {
      return newArr1;
    } else {
      throw new LoggersDoesNotExistError(`Returned number of loggers: ${responseJson.loggers.logger.length}`);
    }
  }
}
