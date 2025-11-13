// Xilog Data Logger
export type LoggerChannel = {
  index: string;
  readingType: string;
  dataType: number;
  UnitType: number;
};

export type LoggerDetails = {
  serial: number;
  name: string;
  channels: Array<LoggerChannel>;
  location: {
    latitude: number;
    longitude: number;
  };
};

export type LoggerEntry = {
  timestamp: string;
  value: number;
};

export type LoggerChannelEntry = {
  channel: LoggerChannel;
  data: Array<LoggerEntry>;
};

export type LoggerFilterBody = {
  serialNumber: string;
  channel: string;
  startDateTime: string;
  endDateTime: string;
};

export type LatestLoggerEntryFilter = {
  serialNumber: string;
  channel: string;
};

// Multilog Data Logger
// START - Converted from XML
export type MultilogBody = {
  loggers: {
    children: Array<{ summary: { children: Array<MultilogSummaryChildren> } } | MultilogLoggerBody>;
  };
};

export type MultilogLoggerBody = {
  logger: { children: Array<MultilogLoggerChildren> };
};

export type MultilogSummaryChildren = {
  APIVersion?: { content: string } | object;
  accountID?: { content: string } | object;
  accountName?: { content: string } | object;
  accountOwnerId?: { content: string } | object;
  accountHighestMessage?: { content: string } | object;
  accountUpdateTime?: { content: string } | object;
  accountNumLoggers?: { content: string } | object;
  CentreLongitude?: { content: string } | object;
  CentreLatitude?: { content: string } | object;
  MinimumPhoto?: { content: string } | object;
};

export type MultilogLoggerChildren = {
  loggerid?: { content: string } | object;
  mobileNumber?: { content: string } | object;
  dateLastMessageReceived?: { content: string } | object;
  type?: { content: string } | object;
  serialNumber?: { content: string } | object;
  loggerOwner?: { content: string } | object;
  LogRate?: { content: string } | object;
  RST?: { content: string } | object;
  RET?: { content: string } | object;
  gsmDataNumber?: { content: string } | object;
  notes?: { content: string } | object;
  batteryCondition?: { content: string } | object;
  signalStrength?: { content: string } | object;
  lastReportedVersion?: { content: string } | object;
  dateCreated?: { content: string } | object;
  dateUpdated?: { content: string } | object;
  heightAOD?: { content: string } | object;
  startDate?: { content: string } | object;
  endDate?: { content: string } | object;
  maintenanceflag?: { content: string } | object;
  id?: { content: string } | object;
  owner?: { content: string } | object;
  siteId?: { content: string } | object;
  siteName?: { content: string } | object;
  SiteNotes?: { content: string } | object;
  latitude?: { content: string } | object;
  longitude?: { content: string } | object;
  channel1Type?: { content: string } | object;
  flowPulseFactor1?: { content: string } | object;
  meterRead1Value?: { content: string } | object;
  meterRead1Date?: { content: string } | object;
  channel2Type?: { content: string } | object;
  flowPulseFactor2?: { content: string } | object;
  meterRead2Value?: { content: string } | object;
  meterRead2Date?: { content: string } | object;
  channels?: { children: Array<MultilogLoggerChannel> };
};

export type MultilogLoggerChannel = {
  channel: {
    number: string;
    children: Array<MultilogLoggerChannelChild>;
  };
};

export type MultilogLoggerChannelChild = {
  channelName?: { content: string } | object;
  offset?: { content: string } | object;
  flowPulseFactor?: { content: string } | object;
  meterReadValue?: { content: string } | object;
  meterReadDate?: { content: string } | object;
  calvalue?: { content: string } | object;
  loggercalvalue?: { content: string } | object;
  loggeroffset?: { content: string } | object;
  ignoreloggervalues?: { content: string } | object;
  is4to20?: { content: string } | object;
  loggerIs4to20?: { content: string } | object;
  invertnegativevalues?: { content: string } | object;
  lastValue?: { content: string } | object;
  lastValueDate?: { content: string } | object;
  measurement?: {
    id: string;
    children: Array<MultilogLoggerChannelMeasurement>;
  };
};

export type MultilogLoggerChannelMeasurement = {
  name?: { content: string } | object;
  reference?: { content: string } | object;
  units?: {
    children: Array<{ symbols?: { content: string } | object }>;
  };
};
// END - Converted from XML

// START - Mutated from converted JSON_to_XML
export type MultilogLogger = {
  loggerid: string;
  mobileNumber: string;
  dateLastMessageReceived: string;
  type: string;
  serialNumber: string;
  loggerOwner: string;
  LogRate: string;
  RST: string;
  RET: string;
  gsmDataNumber: string;
  notes: string;
  batteryCondition: string;
  signalStrength: string;
  lastReportedVersion: string;
  dateCreated: string;
  dateUpdated: string;
  heightAOD: string;
  startDate: string;
  endDate: string;
  maintenanceflag: string;
  id: string;
  owner: string;
  siteId: string;
  siteName: string;
  SiteNotes: string;
  latitude: string;
  longitude: string;
  channel1Type: string;
  flowPulseFactor1: string;
  meterRead1Value: string;
  meterRead1Date: string;
  channel2Type: string;
  flowPulseFactor2: string;
  meterRead2Value: string;
  meterRead2Date: string;
  channels: Array<MultilogChannel>;
};

export type MultilogChannel = {
  channelName: string;
  offset: string;
  flowPulseFactor: string;
  meterReadValue: string;
  meterReadDate: string;
  calvalue: string;
  loggercalvalue: string;
  loggeroffset: string;
  ignoreloggervalues: string;
  is4to20: string;
  loggerIs4to20: string;
  invertnegativevalues: string;
  lastValue: string;
  lastValueDate: string;
  measurement: {
    name: string;
    reference: string;
    units: {
      symbols: string;
    };
  };
};

// END - Mutated from converted JSON_to_XML
