import { NOT_FOUND } from "@nsa/server/constants/httpStatusCodes";
import { NOT_FOUND as NOT_FOUND_MESSAGE } from "@nsa/server/constants/httpStatusPhrases";
import { jsonError } from "@nsa/server/helpers/jsonError";
import type { AppBindings } from "@nsa/server/helpers/types";
import type { NotFoundHandler } from "hono";

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
