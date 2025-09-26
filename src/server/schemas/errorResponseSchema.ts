import { z } from "zod";

export const ErrorResponseSchema = z.object({
  name: z.string().optional(),
  status: z.number(),
  message: z.string(),
  description: z.string().optional(),
  fields: z.record(z.string()).optional(),
  path: z.string().optional(),
  stack: z.string().optional(),
});
