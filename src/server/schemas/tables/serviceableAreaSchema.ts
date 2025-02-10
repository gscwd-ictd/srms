import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { serviceableAreas } from "@srms/server/db/schemas";
import { z } from "zod";

export const SelectServiceableAreaSchema = createSelectSchema(serviceableAreas);

export const CreateServiceableAreaSchema = createInsertSchema(serviceableAreas)
  .omit({
    id: true,
    boundaries: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    boundaries: z.array(z.tuple([z.number(), z.number()])),
  });
