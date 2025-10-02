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

// export type LoggersList = {
//   data: Array<LoggerDetails>;
//   status: number;
//   statusText: string;
// };

export type LoggerEntry = {
  timestamp: string;
  value: number;
};

export type LoggerChannelEntry = {
  channel: LoggerChannel;
  data: Array<LoggerEntry>;
};

export type LoggerChannelEntries = {
  data: LoggerChannelEntry;
  status: number;
  statusText: string;
};

export type LoggerFilterBody = {
  serialNumber: string;
  channel: string;
  startDateTime: string;
  endDateTime: string;
};
