import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { applicantAddress } from "@srms/server/db/schemas";
import { z } from "zod";

export const SelectApplicantAddressFlatSchema = createSelectSchema(applicantAddress);

export const SelectApplicantAddressSchema = createSelectSchema(applicantAddress)
  .omit({
    barangay: true,
  })
  .extend({
    barangay: z.object({
      id: z.string(),
      name: z.string(),
    }),
  });

export const CreateApplicantAddressSchema = createInsertSchema(applicantAddress)
  .omit({
    id: true,
    barangay: true,
    city: true,
    province: true,
    zipCode: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    barangay: z.string().min(5),
  });
