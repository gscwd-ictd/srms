import { applications, applicationView } from "@srms/server/db/schemas";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { CreateApplicantSchema } from "./ApplicantSchema";
import { CreateApplicantFixtures } from "./ApplicantFixtureSchema";
import { CreateApplicantAddressSchema } from "./ApplicantAddressSchema";
import { CreateApplicantHouseholdSchema } from "./ApplicantHouseholdSchema";

export const SelectApplicationSchema = createSelectSchema(applicationView);

export const CreateApplicationSchema = createInsertSchema(applications)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    applicant: CreateApplicantSchema.omit({ applicationId: true }),
    address: CreateApplicantAddressSchema.omit({ applicantId: true }),
    household: CreateApplicantHouseholdSchema.omit({ applicantId: true }),
    fixtures: CreateApplicantFixtures.omit({ applicationId: true }).array(),
  })
  .openapi({
    description: "The application details as indicated in the SACO form.",
  });
