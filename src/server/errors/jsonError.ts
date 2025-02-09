import { type Context } from "hono";
import type { AppBindings, ErrorResponse } from "@srms/server/types";
import type { ContentfulStatusCode } from "hono/utils/http-status";

// Create a type-safe wrapper for c.json specifically for error responses
export function jsonError(
  c: Context<AppBindings>,
  data: ErrorResponse,
  status: ContentfulStatusCode,
): Response {
  return c.json(data, status);
}
