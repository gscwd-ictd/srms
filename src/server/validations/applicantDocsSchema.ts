import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { applicantDocs } from "../db/schemas/applicantDocs";
import { z } from "zod";

export const FileUploadSchema = z.object({
  filename: z.string().min(1),
  url: z.string().url(),
});

export const SelectApplicantDocsSchema = createSelectSchema(applicantDocs);

export const CreateApplicantDocsSchema = createInsertSchema(applicantDocs)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .omit({
    proofOfOwnership: true,
    proofOfBilling: true,
    barangayCertificate: true,
    selfieWithValidId: true,
    validId: true,
  })
  .extend({
    proofOfOwnership: z.array(FileUploadSchema),
    proofOfBilling: z.array(FileUploadSchema),
    barangayCertificate: z.array(FileUploadSchema),
    validId: z.array(FileUploadSchema),
    selfieWithValidId: FileUploadSchema,
  });
