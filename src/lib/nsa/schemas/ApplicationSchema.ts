import { applications } from "@srms/server/db/schemas";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { CreateApplicantSchema, SelectApplicantSchema } from "./ApplicantSchema";
import { CreateApplicantFixtures, SelectApplicantFixtures } from "./ApplicantFixtureSchema";
import { CreateApplicantAddressSchema, SelectApplicantAddressSchema } from "./ApplicantAddressSchema";
import { CreateApplicantHouseholdSchema, SelectApplicantHouseholdSchema } from "./ApplicantHouseholdSchema";

export const SelectApplicationSchema = createSelectSchema(applications).extend({
  applicant: SelectApplicantSchema,
  address: SelectApplicantAddressSchema,
  household: SelectApplicantHouseholdSchema,
  fixtures: SelectApplicantFixtures.array(),
});

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
