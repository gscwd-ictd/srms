// import { createInsertSchema, createSelectSchema } from "drizzle-zod";
// import { applications } from "@srms/server/db/schemas";
// import { SelectApplicantSchema } from "@srms/server/schemas/tables/applicantSchema";
// import { SelectApplicantHouseholdSchema } from "@srms/server/schemas/tables/applicantHouseholdSchema";
// import { SelectApplicantAddressSchema } from "@srms/server/schemas/tables/applicantAddressSchema";

// export const SelectApplicationSchema = createSelectSchema(applications);

// export const CreateApplicationSchema = createInsertSchema(applications)
//   .omit({
//     id: true,
//     createdAt: true,
//     updatedAt: true,
//   })
//   .openapi({
//     description: "The application details as indicated in the SACO form.",
//   });

// export const SelectApplicationDetailsSchema = createSelectSchema(applications).extend({
//   applicant: SelectApplicantSchema,
//   address: SelectApplicantAddressSchema,
//   household: SelectApplicantHouseholdSchema,
//   // documents: SelectApplicantDocsSchema.omit({
//   //   proofOfLotOwnership: true,
//   //   proofOfBilling: true,
//   //   barangayCertificate: true,
//   //   selfieWithValidId: true,
//   //   validId: true,
//   // }).extend({
//   //   proofOfLotOwnership: z.array(FileUploadSchema),
//   //   proofOfBilling: z.array(FileUploadSchema),
//   //   barangayCertificate: z.array(FileUploadSchema),
//   //   validId: z.array(FileUploadSchema),
//   //   selfieWithValidId: FileUploadSchema,
//   // }),
// });
