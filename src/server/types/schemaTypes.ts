import { z } from "zod";

import { CreateApplicantSchema, SelectApplicantSchema } from "@srms/server/schemas/tables/applicantSchema";

import {
  CreateApplicantDocsSchema,
  FileSchema,
  FileUploadSchema,
  SelectApplicantDocsSchema,
} from "@srms/server/schemas/tables/applicantDocsSchema";

import {
  CreateApplicationSchema,
  SelectApplicationDetailsSchema,
  SelectApplicationSchema,
} from "@srms/server/schemas/tables/applicationSchema";

/* new */
export type DocumentUpload = z.infer<typeof FileSchema>;

export type FileUpload = z.infer<typeof FileUploadSchema>;
export type ApplicantDocs = z.infer<typeof SelectApplicantDocsSchema>;
export type CreateApplicantDocs = z.infer<typeof CreateApplicantDocsSchema>;

export type Applicant = z.infer<typeof SelectApplicantSchema>;
export type CreateApplicant = z.infer<typeof CreateApplicantSchema>;

export type Application = z.infer<typeof SelectApplicationSchema>;
export type ApplicationDetails = z.infer<typeof SelectApplicationDetailsSchema>;
export type CreateApplication = z.infer<typeof CreateApplicationSchema>;
