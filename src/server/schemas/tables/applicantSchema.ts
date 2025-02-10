import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { applicants } from "@srms/server/db/schemas";
import { CreateApplicantAddressSchema } from "@srms/server/schemas/tables/applicantAddressSchema";
import { CreateApplicantHouseholdSchema } from "@srms/server/schemas/tables/applicantHouseholdSchema";
import { CreateApplicantDocsSchema } from "@srms/server/schemas/tables/applicantDocsSchema";
import { z } from "zod";

export const SelectApplicantSchema = createSelectSchema(applicants);

export const CreateApplicantSchema = createInsertSchema(applicants)
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
  })
  .openapi({
    description: "The details of an individual or entity requesting for a new water service connection",
  });
