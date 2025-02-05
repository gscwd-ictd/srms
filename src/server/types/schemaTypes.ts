import { z } from "zod";
import {
  CreateApplicantAddressSchema,
  CreateApplicantDocsSchema,
  CreateApplicantHouseholdSchema,
  CreateApplicantsSchema,
  CreateApplicationsSchema,
  FileUploadSchema,
  SelectApplicantAddressSchema,
  SelectApplicantDocsSchema,
  SelectApplicantHouseholdSchema,
  SelectApplicantsSchema,
  SelectApplicationDetailsSchema,
  SelectApplicationsSchema,
} from "../schemas";

export type ApplicantAddress = z.infer<typeof SelectApplicantAddressSchema>;
export type CreateApplicantAddress = z.infer<typeof CreateApplicantAddressSchema>;

export type FileUpload = z.infer<typeof FileUploadSchema>;
export type ApplicantDocs = z.infer<typeof SelectApplicantDocsSchema>;
export type CreateApplicantDocs = z.infer<typeof CreateApplicantDocsSchema>;

export type ApplicantHousehold = z.infer<typeof SelectApplicantHouseholdSchema>;
export type CreateApplicantHousehold = z.infer<typeof CreateApplicantHouseholdSchema>;

export type Applicant = z.infer<typeof SelectApplicantsSchema>;
export type CreateApplicant = z.infer<typeof CreateApplicantsSchema>;

export type Application = z.infer<typeof SelectApplicationsSchema>;
export type ApplicationDetails = z.infer<typeof SelectApplicationDetailsSchema>;
export type CreateApplication = z.infer<typeof CreateApplicationsSchema>;
