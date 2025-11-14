import { AppRouteHandler } from "@srms/server/types/appTypes";
import {
  GetValvesGeoJsonRoute,
  GetPipelinesGeoJsonRoute,
  GetXilogLoggersListRoute,
  GetXilogLoggerChannelEntriesRoute,
  GetXilogChannelLatestEntriesRoute,
  GetMultilogLoggersListRoute,
  GetMultilogChannelLatestEntryRoute,
} from "./pms.routes";
import { pmsManager } from "@srms/server/app";
import { z } from "zod";
import {
  SelectPipelinesGeoJSONSchema,
  SelectValvesGeoJSONSchema,
  SelectLoggersListData,
  SelectLoggerChannelEntry,
  SelectMultilogLoggers,
} from "@srms/lib/pms/schemas";

type ValvesSchema = z.infer<typeof SelectValvesGeoJSONSchema>;
type PipelinesSchema = z.infer<typeof SelectPipelinesGeoJSONSchema>;
type XilogLoggerListSchema = z.infer<typeof SelectLoggersListData>;
type LoggerChannelEntrySchema = z.infer<typeof SelectLoggerChannelEntry>;
type MultilogLoggerListSchema = z.infer<typeof SelectMultilogLoggers>;

export const getValvesGeoJson: AppRouteHandler<GetValvesGeoJsonRoute> = async (c) => {
  const valvesGeoJson = (await pmsManager.getValvesService().getValvesGeoJson()) as ValvesSchema;

  return c.json(valvesGeoJson, 200);
};

export const getPipelinesGeoJson: AppRouteHandler<GetPipelinesGeoJsonRoute> = async (c) => {
  const pipelinesGeoJson = (await pmsManager.getPipelinesService().getPipelinesGeoJson()) as PipelinesSchema;

  return c.json(pipelinesGeoJson, 200);
};

export const getXilogLoggersList: AppRouteHandler<GetXilogLoggersListRoute> = async (c) => {
  const loggersList = (await pmsManager.getLoggersService().getXilogLoggersList()) as XilogLoggerListSchema;

  return c.json(loggersList, 200);
};

export const getXilogLoggerChannelEntries: AppRouteHandler<GetXilogLoggerChannelEntriesRoute> = async (c) => {
  const body = c.req.valid("json");

  const loggerChannelEntries = (await pmsManager
    .getLoggersService()
    .getXilogLoggerChannelEntries(body)) as LoggerChannelEntrySchema;

  return c.json(loggerChannelEntries, 200);
};

export const getXilogChannelLatestEntries: AppRouteHandler<GetXilogChannelLatestEntriesRoute> = async (c) => {
  const serialNumber = c.req.param("serialNumber");
  const channel = c.req.param("channel");

  const loggerChannelLatestEntries = (await pmsManager
    .getLoggersService()
    .getXilogChannelLatestEntries(serialNumber, channel)) as LoggerChannelEntrySchema;

  return c.json(loggerChannelLatestEntries, 200);
};

export const getMultilogLoggersList: AppRouteHandler<GetMultilogLoggersListRoute> = async (c) => {
  const multilogLoggersList = (await pmsManager
    .getLoggersService()
    .getMultilogLoggersList()) as MultilogLoggerListSchema;

  return c.json(multilogLoggersList, 200);
};

export const getMultilogChannelLatestEntry: AppRouteHandler<GetMultilogChannelLatestEntryRoute> = async (
  c,
) => {
  const serialNumber = c.req.param("serialNumber");

  const multilogLoggerDetails = (await pmsManager
    .getLoggersService()
    .getMultilogChannelLatestEntry(serialNumber)) as MultilogLoggerListSchema;

  return c.json(multilogLoggerDetails, 200);
};
