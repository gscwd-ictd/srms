import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { applicants } from "@nsa/server/db/schemas/applicants";
import { z } from "zod";
import { CreateApplicantAddressSchema } from "@nsa/server/validations/applicantAddressSchema";
import { CreateApplicantHouseholdSchema } from "@nsa/server/validations/applicantHouseholdSchema";
import { CreateApplicantDocsSchema } from "@nsa/server/validations/applicantDocsSchema";

export const SelectApplicantsSchema = createSelectSchema(applicants);

export const CreateApplicantsSchema = createInsertSchema(applicants)
  .omit({
    id: true,
    applicationId: true,
    email: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    email: z.string().email().optional(),
    address: CreateApplicantAddressSchema.omit({ applicantId: true }),
    household: CreateApplicantHouseholdSchema.omit({ applicantId: true }),
    documents: CreateApplicantDocsSchema.omit({ applicantId: true }),
  })
  .superRefine((data, ctx) => {
    if (data.firstName.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 3,
        type: "string",
        inclusive: true,
        path: ["firstName"],
      });
    }

    if (data.lastName.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 3,
        type: "string",
        inclusive: true,
        path: ["lastName"],
      });
    }

    if (data.mobileNo.length < 11) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 11,
        type: "string",
        inclusive: true,
        path: ["mobileNo"],
      });
    }
  });
