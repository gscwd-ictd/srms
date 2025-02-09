import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { applications } from "@srms/server/db/schemas";
import {
  FileUploadSchema,
  SelectApplicantAddressSchema,
  SelectApplicantDocsSchema,
  SelectApplicantHouseholdSchema,
  SelectApplicantsSchema,
} from "@srms/server/schemas";
import { z } from "zod";

export const SelectApplicationsSchema = createSelectSchema(applications);

export const CreateApplicationsSchema = createInsertSchema(applications)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .openapi({
    description: "The application details as indicated in the SACO form.",
  });

export const SelectApplicationDetailsSchema = createSelectSchema(applications).extend({
  applicant: SelectApplicantsSchema,
  address: SelectApplicantAddressSchema,
  household: SelectApplicantHouseholdSchema,
  documents: SelectApplicantDocsSchema.omit({
    proofOfOwnership: true,
    proofOfBilling: true,
    barangayCertificate: true,
    selfieWithValidId: true,
    validId: true,
  }).extend({
    proofOfOwnership: z.array(FileUploadSchema),
    proofOfBilling: z.array(FileUploadSchema),
    barangayCertificate: z.array(FileUploadSchema),
    validId: z.array(FileUploadSchema),
    selfieWithValidId: FileUploadSchema,
  }),
});
