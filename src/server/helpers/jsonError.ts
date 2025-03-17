import { type Context } from 'hono';
import type { AppBindings } from '@srms/server/types/appTypes';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { ErrorResponse } from '../types/helperTypes';

// Create a type-safe wrapper for c.json specifically for error responses
export const jsonError = (
  c: Context<AppBindings>,
  data: ErrorResponse,
  status: ContentfulStatusCode,
): Response => {
  return c.json(data, status);
};
