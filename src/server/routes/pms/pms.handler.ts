import { AppRouteHandler } from "@srms/server/types/appTypes";
import {
  GetValvesGeoJsonRoute,
  GetPipelinesGeoJsonRoute,
  GetLoggersListRoute,
  GetLoggerChannelEntriesRoute,
} from "./pms.routes";
import { pmsManager } from "@srms/server/app";
import { z } from "zod";
import {
  SelectPipelinesGeoJSONSchema,
  SelectValvesGeoJSONSchema,
  SelectLoggersListData,
  SelectLoggerChannelEntry,
} from "@srms/lib/pms/schemas";

type ValvesSchema = z.infer<typeof SelectValvesGeoJSONSchema>;
type PipelinesSchema = z.infer<typeof SelectPipelinesGeoJSONSchema>;
type LoggerListSchema = z.infer<typeof SelectLoggersListData>;
type LoggerChannelEntrySchema = z.infer<typeof SelectLoggerChannelEntry>;

export const getValvesGeoJson: AppRouteHandler<GetValvesGeoJsonRoute> = async (c) => {
  const valvesGeoJson = (await pmsManager.getValvesService().getValvesGeoJson()) as ValvesSchema;

  return c.json(valvesGeoJson, 200);
};

export const getPipelinesGeoJson: AppRouteHandler<GetPipelinesGeoJsonRoute> = async (c) => {
  const pipelinesGeoJson = (await pmsManager.getPipelinesService().getPipelinesGeoJson()) as PipelinesSchema;

  return c.json(pipelinesGeoJson, 200);
};

export const getLoggersList: AppRouteHandler<GetLoggersListRoute> = async (c) => {
  const loggersList = (await pmsManager.getLoggersService().getLoggersList()) as LoggerListSchema;

  return c.json(loggersList, 200);
};

export const getLoggerChannelEntries: AppRouteHandler<GetLoggerChannelEntriesRoute> = async (c) => {
  const body = c.req.valid("json");

  const loggerChannelEntries = (await pmsManager
    .getLoggersService()
    .getLoggerChannelEntries(body)) as LoggerChannelEntrySchema;

  return c.json(loggerChannelEntries, 200);
};
