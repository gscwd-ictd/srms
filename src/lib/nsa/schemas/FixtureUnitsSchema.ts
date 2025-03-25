import { fixtureUnits } from "@srms/server/db/schemas";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const createFixtureUnitsSchema = createInsertSchema(fixtureUnits)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .openapi({
    description: "Add a fixture unit by year and the fixture id",
  });

export const selectFixtureUnitsSchema = createSelectSchema(fixtureUnits);
export const updateFixtureUnitsSchema = createUpdateSchema(fixtureUnits)
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .openapi({
    description: "Update a fixture unit",
  });
