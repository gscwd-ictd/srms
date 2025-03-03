import { plumbingFixtures } from "@srms/server/db/schemas/plumbingFixtures";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const SelectPlumbingFixtureSchema = createSelectSchema(plumbingFixtures);

export const CreatePlumbingFixtureSchema = createInsertSchema(plumbingFixtures)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    file: z.instanceof(File),
  });
