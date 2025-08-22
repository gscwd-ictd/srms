import { createRoute } from "@hono/zod-openapi";
import { TAGS } from "@srms/utils/constants";
import * as HttpStatusCodes from "@srms/utils/httpStatusCodes";
import { ErrorResponseSchema } from "@srms/server/schemas/helperSchemas";
import { SelectWaterMetersGeoJSONSchema } from "@srms/lib/watermeters/schemas";
import { OpenAPIResponses } from "@srms/server/constants/openApiResponses";

export const getWaterMetersGeoJson = createRoute({
  tags: TAGS.WATER_METERS,
  description: "Get water meters data",
  method: "get",
  path: "/v1/layers/water-meters",
  operationId: "getWaterMetersGeoJson",
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectWaterMetersGeoJSONSchema,
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

export type GetWaterMetersGeoJsonRoute = typeof getWaterMetersGeoJson;
