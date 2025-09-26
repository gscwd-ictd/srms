import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "@hono/zod-openapi";
import { plumbingFixtures } from "@srms/server/db/schemas";

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

export const UpdatePlumbingFixtureSchema = createUpdateSchema(plumbingFixtures)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    file: z.instanceof(File).optional(),
  });
