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

export const SelectLoggersList = z.object({
  data: z.array(SelectLoggerDetails),
  status: z.number(),
  statusText: z.string(),
});

export const SelectLoggerEntry = z.object({
  timestamp: z.string(),
  value: z.number(),
});

export const SelectLoggerChannelEntry = {
  channel: SelectLoggerChannel,
  data: z.array(SelectLoggerEntry),
};

export const SelectLoggerChannelEntries = {
  data: SelectLoggerChannelEntry,
  status: z.number(),
  statusText: z.string(),
};
