import { jsonb, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { generateCuid } from "@srms/server/helpers/generateCuid";
import { applicants } from "@srms/server/db/schemas/applicants";
import { FileUploadSchema } from "@srms/server/schemas";
import { z } from "zod";

type FileUpload = z.infer<typeof FileUploadSchema>;

export const applicantDocs = pgTable("applicant_docs", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => generateCuid()),
  applicantId: varchar("applicant_id_fk")
    .notNull()
    .references(() => applicants.id),
  proofOfOwnership: jsonb("proof_of_ownership").$type<FileUpload[]>().notNull(),
  proofOfBilling: jsonb("proof_of_billing").$type<FileUpload[]>().notNull(),
  barangayCertificate: jsonb("barangay_certificate").$type<FileUpload[]>().notNull(),
  validId: jsonb("valid_id").$type<FileUpload[]>().notNull(),
  selfieWithValidId: jsonb("selfie_with_valid_id").$type<FileUpload>().notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
