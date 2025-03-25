import { applicants } from "@srms/server/db/schemas";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "@hono/zod-openapi";

export const SelectApplicantSchema = createSelectSchema(applicants);

export const CreateApplicantSchema = createInsertSchema(applicants)
  .omit({
    id: true,
    email: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    email: z.string().optional(),
    firstName: z.string().min(3, { message: "First name must be at least 3 characters long" }),
    lastName: z.string().min(3, "Last name must be at least 3 characters long"),
    mobileNo: z.string().min(11, "Mobile number must be at least 11 digits"),
  })
  .openapi({
    description: "The details of an individual or entity requesting for a new water service connection",
  });

/*  
  for clarrification

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
    
*/
