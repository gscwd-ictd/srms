import { integer, pgTable, timestamp, unique, varchar } from "drizzle-orm/pg-core";
import { generateCuid } from "@srms/server/helpers/generateCuid";
import { applications } from "@srms/server/db/schemas/applications";
import { plumbingFixtures } from "@srms/server/db/schemas/plumbingFixtures";

export const applicantPlumbingFixtures = pgTable(
  "applicant_plumbing_fixtures",
  {
    id: varchar("applicant_plumbing_fixture_id")
      .primaryKey()
      .$defaultFn(() => generateCuid())
      .notNull(),
    applicationId: varchar("application_id_fk")
      .references(() => applications.id, { onDelete: "cascade" })
      .notNull(),
    fixtureId: varchar("plumbing_fixture_id_fk")
      .references(() => plumbingFixtures.id, { onDelete: "cascade" })
      .notNull(),
    quantity: integer("quantity").default(0).notNull(),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [unique().on(table.applicationId, table.fixtureId)],
);
