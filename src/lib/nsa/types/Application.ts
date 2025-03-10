import {
  CreateApplicantSchema,
  CreateApplicationSchema,
  SelectApplicantSchema,
  SelectApplicationSchema,
} from "@srms/server/db/schemas";
import { z } from "zod";

export type Application = z.infer<typeof SelectApplicationSchema>;
export type CreateApplication = z.infer<typeof CreateApplicationSchema>;

export type Applicant = z.infer<typeof SelectApplicantSchema>;
export type CreateApplicant = z.infer<typeof CreateApplicantSchema>;
