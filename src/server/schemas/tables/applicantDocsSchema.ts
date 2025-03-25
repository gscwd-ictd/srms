// import { createInsertSchema, createSelectSchema } from "drizzle-zod";
// import { applicantDocs, applicantDocuments } from "@srms/server/db/schemas";
// import { z } from "zod";

// export const FileUploadSchema = z.object({
//   filename: z.string().min(1),
//   url: z.string().url(),
// });

// export const SelectApplicantDocsSchema = createSelectSchema(applicantDocs);

// export const CreateApplicantDocsSchema = createInsertSchema(applicantDocs)
//   .omit({
//     id: true,
//     createdAt: true,
//     updatedAt: true,
//   })
//   .omit({
//     proofOfLotOwnership: true,
//     proofOfBilling: true,
//     barangayCertificate: true,
//     selfieWithValidId: true,
//     validId: true,
//   })
//   .extend({
//     proofOfLotOwnership: z.array(FileUploadSchema),
//     proofOfBilling: z.array(FileUploadSchema),
//     barangayCertificate: z.array(FileUploadSchema),
//     validId: z.array(FileUploadSchema),
//     selfieWithValidId: FileUploadSchema,
//   });

// /* new */

// export const FileSchema = z.object({
//   url: z.string().url(),
// });

// export const CreateApplicantDocumentSchema = createInsertSchema(applicantDocuments)
//   .omit({
//     id: true,
//     createdAt: true,
//     updatedAt: true,
//   })
//   .extend({
//     documentPaths: z.array(FileSchema),
//   });
