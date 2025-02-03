import { generateCuid } from "@nsa/server/helpers/generateCuid";
import { jsonb, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";
import { applicants } from "@nsa/server/db/schemas/applicants";
import { FileUploadSchema } from "@nsa/server/validations/applicantDocsSchema";

type FileUpload = z.infer<typeof FileUploadSchema>;

export const applicantDocs = pgTable("applicant_docs", {
  id: varchar("applicant_docs_id")
    .primaryKey()
    .$defaultFn(() => generateCuid()),
  applicantId: varchar("applicant_id_fk")
    .notNull()
    .references(() => applicants.id),
  proofOfOwnership: jsonb("proof_of_ownership").$type<FileUpload[]>(),
  proofOfBilling: jsonb("proof_of_billing").$type<FileUpload[]>(),
  barangayCertificate: jsonb("barangay_certificate").$type<FileUpload[]>(),
  validId: jsonb("valid_id").$type<FileUpload[]>(),
  selfieWithValidId: jsonb("selfie_with_valid_id").$type<FileUpload>(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
