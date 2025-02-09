import { NOT_FOUND } from "@srms/server/constants/httpStatusCodes";
import { NOT_FOUND as NOT_FOUND_MESSAGE } from "@srms/server/constants/httpStatusPhrases";
import { jsonError } from "@srms/server/errors";
import type { NotFoundHandler } from "hono";
import type { AppBindings } from "@srms/server/types";

export const notFound: NotFoundHandler<AppBindings> = (c) => {
  c.var.logger.error(`${NOT_FOUND_MESSAGE} - ${c.req.path}`);

  return jsonError(
    c,
    {
      status: NOT_FOUND,
      message: NOT_FOUND_MESSAGE,
      description: "Make sure you requested the correct route path.",
      path: c.req.path,
    },
    NOT_FOUND,
  );
};
