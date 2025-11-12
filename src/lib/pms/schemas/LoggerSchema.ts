import { z } from "zod";

// Xilog Data Logger
export const SelectLoggerChannel = z.object({
  index: z.string(),
  readingType: z.string(),
  dataType: z.number(),
  UnitType: z.number(),
});

export const SelectLoggerDetails = z.object({
  serial: z.number(),
  name: z.string(),
  channels: z.array(SelectLoggerChannel),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

export const SelectLoggersListData = z.array(SelectLoggerDetails);

export const SelectLoggerEntry = z.object({
  timestamp: z.string(),
  value: z.number(),
});

export const SelectLoggerChannelEntry = z.object({
  channel: SelectLoggerChannel,
  data: z.array(SelectLoggerEntry),
});

export const LoggerFilterBody = z.object({
  serialNumber: z.string(),
  channel: z.string(),
  startDateTime: z.string(),
  endDateTime: z.string(),
});

export const LatestLoggerEntryFilterSchema = z.object({
  serialNumber: z.string(),
  channel: z.string(),
});

// Multilog Data Logger
export const MultilogChannel = z.object({
  channelName: z.string(),
  offset: z.string(),
  flowPulseFactor: z.string(),
  meterReadValue: z.string(),
  meterReadDate: z.string(),
  calvalue: z.string(),
  loggercalvalue: z.string(),
  loggeroffset: z.string(),
  ignoreloggervalues: z.string(),
  is4to20: z.string(),
  loggerIs4to20: z.string(),
  invertnegativevalues: z.string(),
  lastValue: z.string(),
  lastValueDate: z.string(),
  measurement: z.object({
    name: z.string(),
    reference: z.string(),
    units: z.object({
      symbols: z.string(),
    }),
  }),
});

export const SelectMultilogLoggers = z.array(
  z.object({
    loggerid: z.string(),
    mobileNumber: z.string(),
    dateLastMessageReceived: z.string(),
    type: z.string(),
    serialNumber: z.string(),
    loggerOwner: z.string(),
    LogRate: z.string(),
    RST: z.string(),
    RET: z.string(),
    gsmDataNumber: z.string(),
    notes: z.string(),
    batteryCondition: z.string(),
    signalStrength: z.string(),
    lastReportedVersion: z.string(),
    dateCreated: z.string(),
    dateUpdated: z.string(),
    heightAOD: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    maintenanceflag: z.string(),
    id: z.string(),
    owner: z.string(),
    siteId: z.string(),
    siteName: z.string(),
    SiteNotes: z.string(),
    latitude: z.string(),
    longitude: z.string(),
    channel1Type: z.string(),
    flowPulseFactor1: z.string(),
    meterRead1Value: z.string(),
    meterRead1Date: z.string(),
    channel2Type: z.string(),
    flowPulseFactor2: z.string(),
    meterRead2Value: z.string(),
    meterRead2Date: z.string(),
    channels: z.array(MultilogChannel),
  }),
);
