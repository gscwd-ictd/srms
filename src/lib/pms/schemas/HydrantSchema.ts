import { z } from "zod";

export const SelectHydrantCoordinatesSchema = z.object({
  type: z.string(),
  coordinates: z.array(z.number()).length(2),
});

export const SelectHydrantPropertiesSchema = z.object({
  location: z.string(),
  barangay: z.string(),
  landmark: z.string().nullable(),
  status: z.string(),
});

export const SelectHydrantDataSchema = z.object({
  type: z.string(),
  id: z.string(),
  geometry: SelectHydrantCoordinatesSchema,
  geometry_name: z.string(),
  properties: SelectHydrantPropertiesSchema,
});

export const SelectHydrantGeoJSONSchema = z.object({
  type: z.string(),
  totalFeatures: z.number(),
  features: z.array(SelectHydrantDataSchema),
});
