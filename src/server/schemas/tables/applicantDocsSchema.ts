import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { applicantDocuments } from "@srms/server/db/schemas";
import { z } from "zod";

export const FileUploadSchema = z.object({
  filename: z.string().min(1),
  url: z.string().url(),
});

export const SelectApplicantDocsSchema = createSelectSchema(applicantDocuments);

export const CreateApplicantDocsSchema = createInsertSchema(applicantDocuments)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    proofOfLotOwnership: z.array(FileUploadSchema),
    proofOfBilling: z.array(FileUploadSchema),
    barangayCertificate: z.array(FileUploadSchema),
    validId: z.array(FileUploadSchema),
    selfieWithValidId: FileUploadSchema,
  });
