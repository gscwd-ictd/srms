import { generateCuid } from "@srms/server/helpers";
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { applicants } from "./applicants";
import { plumbingFixtures } from "./plumbingFixtures";

export const applicantPlumbingFixtures = pgTable("applicant_plumbing_fixtures", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => generateCuid()),
  applicantId: varchar("applicant_id_fk")
    .notNull()
    .references(() => applicants.id),
  plumbingFixtureId: varchar("plumbing_fixture_id_fk")
    .references(() => plumbingFixtures.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
