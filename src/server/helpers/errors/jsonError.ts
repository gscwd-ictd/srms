import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { AppBindings, ErrorResponse } from "@nsa/server/helpers/types";
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

// Create a type-safe wrapper for c.json specifically for error responses
export function jsonError(
  c: Context<AppBindings>,
  data: ErrorResponse,
  status: ContentfulStatusCode,
): Response {
  return c.json(data, status);
}
