import type { Hook } from "@hono/zod-openapi";
import type { AppBindings } from "../types/appTypes";
import { UNPROCESSABLE_ENTITY } from "@srms/utils/httpStatusCodes";
import { ZodError } from "zod";
import { formatZodError } from "../errors/formatZodError";
import { jsonError } from "../errors/jsonError";

export const defaultHook: Hook<unknown, AppBindings, string, unknown> = (result, c) => {
  if (!result.success) {
    if (result.error instanceof ZodError) {
      return jsonError(c, formatZodError(result.error), UNPROCESSABLE_ENTITY);
    }
  }
};
