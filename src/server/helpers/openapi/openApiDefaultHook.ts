import type { Hook } from "@hono/zod-openapi";
import { UNPROCESSABLE_ENTITY } from "@nsa/server/constants/httpStatusCodes";
import { formatZodError } from "@nsa/server/helpers/errors/formatZodError";
import { jsonError } from "@nsa/server/helpers/errors/jsonError";
import { ZodError } from "zod";

// eslint-disable-next-line
export const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    if (result.error instanceof ZodError) {
      return jsonError(c, formatZodError(result.error), UNPROCESSABLE_ENTITY);
    }
  }
};
