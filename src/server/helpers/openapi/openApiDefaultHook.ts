import type { Hook } from "@hono/zod-openapi";
import { UNPROCESSABLE_ENTITY } from "@nsa/server/constants/httpStatusCodes";
import { formatZodError } from "../errors/formatZodError";
import { jsonError } from "../errors/jsonError";

// eslint-disable-next-line
export const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    return jsonError(c, formatZodError(result.error), UNPROCESSABLE_ENTITY);
  }
};
