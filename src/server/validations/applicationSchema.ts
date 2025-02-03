import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { applications } from "../db/schemas/applications";
import { SelectApplicantsSchema } from "./applicantSchema";
import { SelectApplicantAddressSchema } from "./applicantAddressSchema";
import { SelectApplicantHouseholdSchema } from "./applicantHouseholdSchema";
import { SelectApplicantDocsSchema } from "./applicantDocsSchema";

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
