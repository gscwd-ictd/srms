import type { Hook } from "@hono/zod-openapi";
import { UNPROCESSABLE_ENTITY } from "@srms/server/constants/httpStatusCodes";
import { formatZodError, jsonError } from "@srms/server/errors";
import { ZodError } from "zod";

// eslint-disable-next-line
export const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    if (result.error instanceof ZodError) {
      return jsonError(c, formatZodError(result.error), UNPROCESSABLE_ENTITY);
    }
  }
};
