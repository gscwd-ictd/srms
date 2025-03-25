// import { createInsertSchema, createSelectSchema } from "drizzle-zod";
// import {
//   applicants,
//   CreateApplicantAddressSchema,
//   CreateApplicantHouseholdSchema,
// } from "@srms/server/db/schemas";
// import { CreateApplicantDocumentSchema } from "@srms/server/schemas/tables/applicantDocsSchema";
// import { z } from "zod";
// import { CreateApplicantPlumbingFixtureSchema } from "./applicantFixtureSchema";

// export const SelectApplicantSchema = createSelectSchema(applicants);

// export const CreateApplicantSchema = createInsertSchema(applicants)
//   .omit({
//     id: true,
//     applicationId: true,
//     email: true,
//     createdAt: true,
//     updatedAt: true,
//   })
//   .extend({
//     email: z.string().email().optional(),
//     address: CreateApplicantAddressSchema.omit({ applicantId: true }),
//     household: CreateApplicantHouseholdSchema.omit({ applicantId: true }),
//     fixtures: z.array(CreateApplicantPlumbingFixtureSchema.omit({ applicantId: true })),
//     documents: z.array(CreateApplicantDocumentSchema.omit({ applicantId: true })),
//   })
//   .superRefine((data, ctx) => {
//     if (data.firstName.length < 3) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.too_small,
//         minimum: 3,
//         type: "string",
//         inclusive: true,
//         path: ["firstName"],
//       });
//     }

//     if (data.lastName.length < 3) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.too_small,
//         minimum: 3,
//         type: "string",
//         inclusive: true,
//         path: ["lastName"],
//       });
//     }

//     if (data.mobileNo.length < 11) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.too_small,
//         minimum: 11,
//         type: "string",
//         inclusive: true,
//         path: ["mobileNo"],
//       });
//     }
//   })
//   .openapi({
//     description: "The details of an individual or entity requesting for a new water service connection",
//   });
