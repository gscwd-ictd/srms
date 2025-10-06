import { z } from "zod";

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
