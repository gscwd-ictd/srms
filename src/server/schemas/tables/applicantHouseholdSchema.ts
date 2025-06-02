import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { applicantHousehold } from "@srms/server/db/schemas";
import { z } from "zod";

export const SelectApplicantHouseholdSchema = createSelectSchema(applicantHousehold);

export const CreateApplicantHouseholdSchema = createInsertSchema(applicantHousehold)
  .omit({
    id: true,
    noOfPersonsInHousehold: true,
    noOfHousesInLot: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    noOfPersonsInHousehold: z.number().nonnegative(),
    noOfHousesInLot: z.number().nonnegative(),
  });
