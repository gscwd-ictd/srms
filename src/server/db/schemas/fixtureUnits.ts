import { generateCuid } from "@srms/server/helpers/generateCuid";
import { decimal, integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { plumbingFixtures } from "./plumbingFixtures";

export const fixtureUnits = pgTable("fixtures_unit", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => generateCuid()),
  plumbingFixturesId: varchar("plumbing_fixtures_id_fk")
    .notNull()
    .references(() => plumbingFixtures.id),
  publicValue: decimal("public_value", { precision: 6, scale: 3 }),
  privateValue: decimal("private_value", { precision: 6, scale: 3 }),
  year: integer("year"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
