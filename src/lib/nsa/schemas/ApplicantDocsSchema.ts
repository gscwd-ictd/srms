import { applicantDocuments } from "@srms/server/db/schemas";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "@hono/zod-openapi";

export const DocumentPathSchema = z.object({
  url: z.string().url().array(),
});

export const SelectApplicantDocsSchema = createSelectSchema(applicantDocuments);

export const CreateApplicantDocsSchema = createInsertSchema(applicantDocuments)
  .omit({
    id: true,
    pathNames: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    pathNames: z.string().array(),
  });
