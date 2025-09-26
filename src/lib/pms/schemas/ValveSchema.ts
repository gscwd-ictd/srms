import { z } from "zod";

export const SelectValveCoordinatesSchema = z.object({
  type: z.string(),
  coordinates: z.array(z.number()).length(2),
});

export const SelectValvePropertiesSchema = z.object({
  diameter: z.string(),
  brand: z.string(),
  "yr.install": z.string(),
  status: z.string(),
  curnt_stat: z.string(),
  type: z.string(),
});

export const SelectValveDataSchema = z.object({
  type: z.string(),
  id: z.string(),
  geometry: SelectValveCoordinatesSchema,
  geometry_name: z.string(),
  properties: SelectValvePropertiesSchema,
});

export const SelectValvesGeoJSONSchema = z.object({
  type: z.string(),
  totalFeatures: z.number(),
  features: z.array(SelectValveDataSchema),
});
