import { applicantPlumbingFixtures } from "@srms/server/db/schemas";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "@hono/zod-openapi";

export const SelectApplicantFixtures = createSelectSchema(applicantPlumbingFixtures);

export const CreateApplicantFixtures = createInsertSchema(applicantPlumbingFixtures)
  .omit({
    id: true,
    quantity: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    quantity: z.number().min(1),
  });
