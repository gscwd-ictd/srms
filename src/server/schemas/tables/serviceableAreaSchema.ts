import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { serviceableAreas } from "@srms/server/db/schemas";
import { FeatureStylesSchema, MultiPolygonSchema, PolygonSchema } from "@srms/server/schemas";
import { z } from "zod";

export const SelectServiceableAreaSchema = createSelectSchema(serviceableAreas);

export const SelectServiceableAreaGeoJSONSchema = createSelectSchema(serviceableAreas)
  .omit({
    boundaries: true,
  })
  .extend({
    boundaries: MultiPolygonSchema,
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
    barangay: z
      .string()
      .min(4)
      .openapi({ description: "The name of barangay that will be covered by the new serviceable area." }),
    boundaries: z.array(z.array(z.array(z.array(z.number())))).openapi({
      description: "Stored as coordinates that represent the boundaries of the area covered.",
    }),
    featureStyles: FeatureStylesSchema,
  });
