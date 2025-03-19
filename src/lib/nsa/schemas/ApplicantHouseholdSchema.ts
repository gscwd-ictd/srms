import { applicantHousehold } from "@srms/server/db/schemas";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const SelectApplicantHouseholdSchema = createSelectSchema(applicantHousehold);

export const CreateApplicantHouseholdSchema = createInsertSchema(applicantHousehold).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
