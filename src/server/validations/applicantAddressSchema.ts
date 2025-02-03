import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { applicantAddress } from "../db/schemas/applicantAddress";
import { z } from "zod";

export const SelectApplicantAddressSchema = createSelectSchema(applicantAddress);

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
