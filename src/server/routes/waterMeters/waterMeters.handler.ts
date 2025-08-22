import { AppRouteHandler } from "@srms/server/types/appTypes";
import { GetWaterMetersGeoJsonRoute } from "./waterMeters.routes";
import { waterMetersManager } from "@srms/server/app";
import { z } from "zod";
import { SelectWaterMetersGeoJSONSchema } from "@srms/lib/watermeters/schemas";

type WaterMetersSchema = z.infer<typeof SelectWaterMetersGeoJSONSchema>;

export const getWaterMetersGeoJson: AppRouteHandler<GetWaterMetersGeoJsonRoute> = async (c) => {
  const geoWaterMetersGeoJson = (await waterMetersManager
    .getWaterMetersService()
    .getWaterMetersGeoJson()) as WaterMetersSchema;

  return c.json(geoWaterMetersGeoJson, 200);
};
