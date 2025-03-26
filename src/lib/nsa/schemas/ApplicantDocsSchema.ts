import { applicantDocuments } from "@srms/server/db/schemas";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "@hono/zod-openapi";

export const SelectApplicantDocsSchema = createSelectSchema(applicantDocuments);

export const CreateApplicantDocsSchema = createInsertSchema(applicantDocuments)
  .omit({
    id: true,
    files: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    files: z.union([z.instanceof(File), z.array(z.instanceof(File))]),
  });
