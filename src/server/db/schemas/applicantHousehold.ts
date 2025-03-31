import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { generateCuid } from "@srms/server/helpers/generateCuid";
import { applicants } from "@srms/server/db/schemas/applicants";

export const applicantHousehold = pgTable("applicant_household", {
  id: varchar("applicant_household_id")
    .primaryKey()
    .$defaultFn(() => generateCuid())
    .notNull(),
  applicantId: varchar("applicant_id_fk")
    .references(() => applicants.id, { onDelete: "cascade" })
    .notNull(),
  noOfPersonsInHousehold: integer("number_of_persons").default(0).notNull(),
  noOfHousesInLot: integer("number_of_houses").default(0).notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
