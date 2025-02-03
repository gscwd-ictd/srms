import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { applications } from "@nsa/server/db/schemas/applications";
import {
  SelectApplicantAddressSchema,
  SelectApplicantDocsSchema,
  SelectApplicantHouseholdSchema,
  SelectApplicantsSchema,
} from "@nsa/server/validations";

export const SelectApplicationsSchema = createSelectSchema(applications);

export const CreateApplicationsSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const SelectApplicationDetailsSchema = createSelectSchema(applications).extend({
  applicant: SelectApplicantsSchema,
  address: SelectApplicantAddressSchema,
  household: SelectApplicantHouseholdSchema,
  documents: SelectApplicantDocsSchema,
});
