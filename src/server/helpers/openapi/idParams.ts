import { z } from "@hono/zod-openapi";

export const IdParamsSchema = z.object({
  id: z.string().openapi({
    param: {
      name: "id",
      in: "path",
      required: true,
    },
    required: ["id"],
    example: "cm6p7d5og0jbx7s65qcu",
  }),
});
