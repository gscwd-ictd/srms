import { z } from "zod";

export const SelectReservoirCoordinatesSchema = z.object({
   type: z.string(),
   coordinates: z.array(z.number()).length(2),
});

export const SelectReservoirPropertiesSchema = z.object({
   source: z.string(),
   location: z.string(),
   cap_gal: z.number(),
   "cap_cu.m": z.number(),
   chamber: z.string(),
   type_res: z.string(),
   material: z.string(),
   status: z.string(),
   system: z.string(),
});

export const SelectReservoirDataSchema = z.object({
   type: z.string(),
   id: z.string(),
   geometry: SelectReservoirCoordinatesSchema,
   geometry_name: z.string(),
   properties: SelectReservoirPropertiesSchema,
 });

export const SelectReservoirsGeoJSONSchema = z.object({
   type: z.string(),
   totalFeatures: z.number(),
   features: z.array(SelectReservoirDataSchema),
});