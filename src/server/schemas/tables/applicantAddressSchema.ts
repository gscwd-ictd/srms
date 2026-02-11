import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { applicantAddress } from "@srms/server/db/schemas";
import { z } from "zod";

export const SelectApplicantAddressSchema = createSelectSchema(applicantAddress);

export const CreateApplicantAddressSchema = createInsertSchema(applicantAddress)
  .omit({
    id: true,
    barangayId: true,
    city: true,
    province: true,
    zipCode: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    barangayId: z.string(),
  });
