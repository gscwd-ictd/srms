import { z } from "zod";

export const SelectPipelineCoordinatesSchema = z.object({
  type: z.string(),
  coordinates: z.array(z.number()).length(2),
});

export const SelectPipelinePropertiesSchema = z.object({
  diameter: z.string(),
  material: z.string(),
});

export const SelectPipelineDataSchema = z.object({
  type: z.string(),
  id: z.string(),
  geometry: SelectPipelineCoordinatesSchema,
  geometry_name: z.string(),
  properties: SelectPipelinePropertiesSchema,
});

export const SelectPipelinesGeoJSONSchema = z.object({
  type: z.string(),
  totalFeatures: z.number(),
  features: z.array(SelectPipelineDataSchema),
});
