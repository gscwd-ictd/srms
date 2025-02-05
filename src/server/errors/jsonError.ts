import { AppBindings, ErrorResponse } from "@nsa/server/types";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

// Create a type-safe wrapper for c.json specifically for error responses
export function jsonError(
  c: Context<AppBindings>,
  data: ErrorResponse,
  status: ContentfulStatusCode,
): Response {
  return c.json(data, status);
}
