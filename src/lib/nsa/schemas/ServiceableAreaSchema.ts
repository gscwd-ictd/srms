import { z } from "zod";

export const CoordinateSchema = z.tuple([z.number(), z.number()]);

export const ServiceableAreaSchema = z.object({
  gid: z.number(),
  purok: z.string(),
  barangay: z.string(),
  coordinates: z.array(z.array(z.array(CoordinateSchema))),
});
