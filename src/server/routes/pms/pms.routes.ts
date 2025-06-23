import { createRoute } from "@hono/zod-openapi";
import { TAGS } from "@srms/utils/constants";
import * as HttpStatusCodes from "@srms/utils/httpStatusCodes";
import { ErrorResponseSchema } from "@srms/server/schemas/helperSchemas";
import { SelectValvesGeoJSONSchema } from "@srms/lib/pms/schemas";
import { OpenAPIResponses } from "@srms/server/constants/openApiResponses";

export const getValvesGeoJson = createRoute({
  tags: TAGS.PRESSURE_MANAGEMENT,
  description: "Get valves data",
  method: "get",
  path: "/v1/layers/valves",
  operationId: "getValvesGeoJson",
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectValvesGeoJSONSchema,
        },
      },
      description: OpenAPIResponses.OK,
    },

    [HttpStatusCodes.NOT_FOUND]: {
      content: {
        "application/json": {
          example: {
            name: "NotFoundError",
            status: 404,
            message: "Layer not found",
          },
          schema: ErrorResponseSchema,
        },
      },
      description: OpenAPIResponses.NOT_FOUND,
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
      description: OpenAPIResponses.INTERNAL_SERVER_ERROR,
    },
  },
});

export type GetGValvesGeoJsonRoute = typeof getValvesGeoJson;
