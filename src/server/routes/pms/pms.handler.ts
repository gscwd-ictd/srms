import { AppRouteHandler } from "@srms/server/types/appTypes";
import { GetValvesGeoJsonRoute, GetPipelinesGeoJsonRoute } from "./pms.routes";
import { pmsManager } from "@srms/server/app";
import { z } from "zod";
import { SelectPipelinesGeoJSONSchema, SelectValvesGeoJSONSchema } from "@srms/lib/pms/schemas";

type ValvesSchema = z.infer<typeof SelectValvesGeoJSONSchema>;
type PipelinesSchema = z.infer<typeof SelectPipelinesGeoJSONSchema>;

export const getValvesGeoJson: AppRouteHandler<GetValvesGeoJsonRoute> = async (c) => {
  const geoValvesGeoJson = (await pmsManager.getValvesService().getValvesGeoJson()) as ValvesSchema;

  return c.json(geoValvesGeoJson, 200);
};

export const getPipelinesGeoJson: AppRouteHandler<GetPipelinesGeoJsonRoute> = async (c) => {
  const geoPipelinesGeoJson = (await pmsManager
    .getPipelinesService()
    .getPipelinesGeoJson()) as PipelinesSchema;

  return c.json(geoPipelinesGeoJson, 200);
};
