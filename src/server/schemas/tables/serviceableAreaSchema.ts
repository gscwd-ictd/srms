import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { serviceableAreas } from "@srms/server/db/schemas";
import { PolygonSchema } from "@srms/server/schemas";
import { z } from "zod";

export const SelectServiceableAreaSchema = createSelectSchema(serviceableAreas);

export const SelectServiceableAreaGeoJSONSchema = createSelectSchema(serviceableAreas)
  .omit({
    boundaries: true,
  })
  .extend({
    boundaries: PolygonSchema,
  });

export const CreateServiceableAreaSchema = createInsertSchema(serviceableAreas)
  .omit({
    id: true,
    boundaries: true,
    barangay: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    barangay: z.string().min(4),
    boundaries: z.array(z.tuple([z.number(), z.number()])),
  });
