import { z } from "zod";

import { ApplicationStatus, ApplicationType, Gender } from "@srms/server/constants";
import { CreateApplicantsSchema, SelectApplicantsSchema } from "@srms/server/schemas/tables/applicantSchema";

import {
  CreateApplicantAddressSchema,
  SelectApplicantAddressSchema,
} from "@srms/server/schemas/tables/applicantAddressSchema";

import {
  CreateApplicantDocsSchema,
  FileUploadSchema,
  SelectApplicantDocsSchema,
} from "@srms/server/schemas/tables/applicantDocsSchema";

import {
  CreateApplicantHouseholdSchema,
  SelectApplicantHouseholdSchema,
} from "@srms/server/schemas/tables/applicantHouseholdSchema";

import {
  CreateApplicationsSchema,
  SelectApplicationDetailsSchema,
  SelectApplicationsSchema,
} from "@srms/server/schemas/tables/applicationSchema";

import {
  CreateServiceableAreasSchema,
  SelectServiceableAreasSchema,
} from "@srms/server/schemas/tables/serviceableAreasSchema";

export type ApplicantAddress = z.infer<typeof SelectApplicantAddressSchema>;
export type CreateApplicantAddress = z.infer<typeof CreateApplicantAddressSchema>;

export type FileUpload = z.infer<typeof FileUploadSchema>;
export type ApplicantDocs = z.infer<typeof SelectApplicantDocsSchema>;
export type CreateApplicantDocs = z.infer<typeof CreateApplicantDocsSchema>;

export type ApplicantHousehold = z.infer<typeof SelectApplicantHouseholdSchema>;
export type CreateApplicantHousehold = z.infer<typeof CreateApplicantHouseholdSchema>;

export type Applicant = z.infer<typeof SelectApplicantsSchema>;
export type CreateApplicant = z.infer<typeof CreateApplicantsSchema>;
export type Gender = (typeof Gender)[number];

export type Application = z.infer<typeof SelectApplicationsSchema>;
export type ApplicationDetails = z.infer<typeof SelectApplicationDetailsSchema>;
export type CreateApplication = z.infer<typeof CreateApplicationsSchema>;
export type ApplicationType = (typeof ApplicationType)[number];
export type ApplicationStatus = (typeof ApplicationStatus)[number];

export type ServiceableArea = z.infer<typeof SelectServiceableAreasSchema>;
export type CreateServiceableArea = z.infer<typeof CreateServiceableAreasSchema>;
