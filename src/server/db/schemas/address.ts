import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { generateCuid } from "@srms/server/helpers/generateCuid";
import { applicants } from "@srms/server/db/schemas/applicants";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

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
  barangayId: text("barangay"),
  city: varchar("city").default("General Santos City").notNull(),
  province: varchar("province").default("South Cotabato").notNull(),
  zipCode: varchar("zip_code", { length: 4 }).default("9500").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const SelectApplicantAddressSchema = createSelectSchema(applicantAddress);

export const CreateApplicantAddressSchema = createInsertSchema(applicantAddress).omit({
  id: true,
  city: true,
  province: true,
  zipCode: true,
  createdAt: true,
  updatedAt: true,
});
