import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { generateCuid } from "@srms/server/helpers/generateCuid";
import { applicants } from "@srms/server/db/schemas/applicants";

export const applicantAddress = pgTable("applicant_address", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => generateCuid())
    .notNull(),
  applicantId: varchar("applicant_id_fk")
    .references(() => applicants.id, { onDelete: "cascade" })
    .notNull(),
  lotNo: varchar("lot_number"),
  blockNo: varchar("block_number"),
  street: varchar("street"),
  prkVillSubd: varchar("purok_village_subdivision"),
  barangayId: text("barangay"),
  city: varchar("city").default("General Santos City").notNull(),
  province: varchar("province").default("South Cotabato").notNull(),
  zipCode: varchar("zip_code", { length: 4 }).default("9500").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
