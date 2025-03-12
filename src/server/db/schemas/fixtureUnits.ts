import { generateCuid } from "@srms/server/helpers/generateCuid";
import { decimal, integer, pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { plumbingFixtures } from "./plumbingFixtures";
import { fixtureUnitType } from "@srms/utils/constants";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const fixtureUnitTypeEnum = pgEnum("fixture_unit_type_enum", fixtureUnitType);

export const fixtureUnits = pgTable("applicant_plumbing_fixtures", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => generateCuid()),
  plumbingFixturesId: varchar("plumbing_fixtures_id_fk")
    .notNull()
    .references(() => plumbingFixtures.id),
  type: fixtureUnitTypeEnum("type"),
  value: decimal("value", { precision: 6, scale: 3 }),
  year: integer("year"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

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
