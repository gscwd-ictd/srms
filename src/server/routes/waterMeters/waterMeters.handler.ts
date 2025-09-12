import { AppRouteHandler } from "@srms/server/types/appTypes";
import {
  GetConsumersMeterDetailsByFilterRoute,
  GetConsumersMeterDetailsRoute,
  GetWaterMetersGeoJsonRoute,
} from "./waterMeters.routes";
import { waterMetersManager } from "@srms/server/app";
import { z } from "zod";
import { SelectWaterMetersGeoJSONSchema } from "@srms/lib/watermeters/schemas";

type WaterMetersSchema = z.infer<typeof SelectWaterMetersGeoJSONSchema>;

export const getWaterMetersGeoJson: AppRouteHandler<GetWaterMetersGeoJsonRoute> = async (c) => {
  const waterMetersGeoJson = (await waterMetersManager
    .getWaterMetersService()
    .getWaterMetersGeoJson()) as WaterMetersSchema;

  return c.json(waterMetersGeoJson, 200);
};

export const getConsumersMeterDetails: AppRouteHandler<GetConsumersMeterDetailsRoute> = async (c) => {
  const pageIndex = c.req.param("pageIndex");
  const pageSize = c.req.param("pageSize");

  const consumersMeterDetails = (await waterMetersManager
    .getWaterMetersService()
    .getConsumersMeterDetails(pageIndex, pageSize)) as WaterMetersSchema;

  return c.json(consumersMeterDetails, 200);
};

export const getConsumersMeterDetailsByFilter: AppRouteHandler<
  GetConsumersMeterDetailsByFilterRoute
> = async (c) => {
  const pageIndex = c.req.param("pageIndex");
  const pageSize = c.req.param("pageSize");
  const body = c.req.valid("json");

  const consumersMeterDetails = (await waterMetersManager
    .getWaterMetersService()
    .getConsumersMeterDetailsByFilter(pageIndex, pageSize, body)) as WaterMetersSchema;

  return c.json(consumersMeterDetails, 200);
};
