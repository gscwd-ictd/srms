import { z } from "@hono/zod-openapi";

export const QueryParamsSchema = z.object({
  limit: z.coerce.number().optional().default(10),
  page: z.coerce.number().optional().default(1),
});
