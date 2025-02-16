import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { generateCuid } from "@srms/server/helpers/generateCuid";
import { applicants } from "@srms/server/db/schemas/applicants";
import { polygon } from "@srms/server/helpers/geo";

export const serviceableAreas = pgTable("serviceable_areas", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => generateCuid()),
  barangay: text("barangay").unique().notNull(),
  boundaries: polygon("boundaries").notNull(),
  details: text("details"),
  /**
   * Add more details...
   */
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const applicantAddress = pgTable("applicant_address", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => generateCuid()),
  applicantId: varchar("applicant_id_fk")
    .notNull()
    .references(() => applicants.id),
  lotNo: varchar("lot_no"),
  blockNo: varchar("block_no"),
  street: varchar("street"),
  prkVillSubd: varchar("prk_vill_subd"),
  barangayId: varchar("barangay_id_fk")
    .references(() => serviceableAreas.id)
    .notNull(),
  city: varchar("city").default("General Santos City").notNull(),
  province: varchar("province").default("South Cotabato").notNull(),
  zipCode: varchar("zip_code", { length: 4 }).default("9500").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
