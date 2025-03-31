import { createRoute } from "@hono/zod-openapi";
import { ServiceableAreaSchema } from "@srms/lib/nsa/schemas";
import { ErrorResponseSchema } from "@srms/server/schemas/helperSchemas";

import * as HttpStatusCodes from "@srms/utils/httpStatusCodes";

export const getAllServiceableAreas = createRoute({
  tags: ["Serviceable Area"],
  description: "GET ALL SERVICEABLE AREA",
  method: "get",
  path: "v1/serviceable-areas",
  operationId: "getAllServiceableAreas",
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: ServiceableAreaSchema.array(),
        },
      },
      description: "",
    },

    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: {
      content: {
        "application/json": {
          example: {
            name: "ServerError",
            status: 500,
            message: "Something went wrong!",
            stack: "...",
          },
          schema: ErrorResponseSchema,
        },
      },
      description: "",
    },
  },
});

export type GetAllServiceableAreaRoute = typeof getAllServiceableAreas;
