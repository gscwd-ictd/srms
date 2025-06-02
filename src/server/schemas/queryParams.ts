import { z } from "@hono/zod-openapi";

export const QueryParamsSchema = z.object({
  limit: z.coerce
    .number()
    .default(10)
    .optional()
    .openapi({
      param: {
        name: "limit",
        required: false,
        in: "query",
      },
      default: 10,
      description: "The number of rows to retreive in a single fetch.",
    })
    .optional(),
  page: z.coerce
    .number()
    .default(1)
    .optional()
    .openapi({
      param: {
        name: "page",
        required: false,
        in: "query",
      },
      default: 1,
      description: "Page number of results to return.",
    })
    .optional(),
});
