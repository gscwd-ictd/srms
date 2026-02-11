import { applicantAddress } from "@srms/server/db/schemas";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const SelectApplicantAddressSchema = createSelectSchema(applicantAddress);

export const CreateApplicantAddressSchema = createInsertSchema(applicantAddress).omit({
  id: true,
  city: true,
  province: true,
  zipCode: true,
  createdAt: true,
  updatedAt: true,
});
