import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { generateCuid } from "@srms/server/helpers/generateCuid";
import { applicants } from "@srms/server/db/schemas/applicants";
import { createSelectSchema } from "drizzle-zod";

export const applicantDocs = pgTable("applicant_docs", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => generateCuid()),
  applicantId: varchar("applicant_id_fk")
    .notNull()
    .references(() => applicants.id),
  proofOfLotOwnership: text("proof_of_lot_ownership").notNull(),
  proofOfBilling: text("proof_of_billing").notNull(),
  barangayCertificate: text("barangay_certificate").notNull(),
  validId: text("valid_id").notNull(),
  selfieWithValidId: text("selfie_with_valid_id").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const SelectApplicantDocsSchema = createSelectSchema(applicantDocs);
