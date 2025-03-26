import {
  CreateApplicantDocsSchema,
  CreateApplicantSchema,
  CreateApplicationSchema,
  SelectApplicantDocsSchema,
  SelectApplicantSchema,
  SelectApplicationSchema,
} from "../schemas";

import { z } from "@hono/zod-openapi";

export type Applicant = z.infer<typeof SelectApplicantSchema>;
export type CreateApplicant = z.infer<typeof CreateApplicantSchema>;

export type Application = z.infer<typeof SelectApplicationSchema>;
export type CreateApplication = z.infer<typeof CreateApplicationSchema>;

export type ApplicantDocs = z.infer<typeof SelectApplicantDocsSchema>;
export type UploadApplicationDocs = z.infer<typeof CreateApplicantDocsSchema>;
