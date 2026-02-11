import { integer, pgTable, timestamp, unique, varchar } from "drizzle-orm/pg-core";
import { applicants } from "./applicants";
import { generateCuid } from "@srms/server/helpers/generateCuid";
import { plumbingFixtures } from "./plumbingFixtures";

export const applicantPlumbingFixtures = pgTable(
  "applicant_plumbing_fixtures",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => generateCuid())
      .notNull(),
    applicantId: varchar("applicant_id_fk")
      .references(() => applicants.id, { onDelete: "cascade" })
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
  (table) => {
    return {
      uniqueApplicantFixture: unique().on(table.applicantId, table.fixtureId),
    };
  },
);
