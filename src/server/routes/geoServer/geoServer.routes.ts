import { createRoute, z } from "@hono/zod-openapi";
import { TAGS } from "@srms/utils/constants";
import * as HttpStatusCodes from "@srms/utils/httpStatusCodes";
import { ErrorResponseSchema } from "@srms/server/schemas/helperSchemas";

export const getGeoServerLayers = createRoute({
  tags: TAGS.GEOSERVER,
  description: "Get layers from GeoServer ",
  method: "get",
  path: "/v1/layers",
  operationId: "getGeoServerLayers",
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: z.array(z.object({})),
        },
      },
      description: "",
    },

    [HttpStatusCodes.NOT_FOUND]: {
      content: {
        "application/json": {
          example: {
            name: "NotFoundError",
            status: 404,
            message: "Fixture Units by this year not found!",
          },
          schema: ErrorResponseSchema,
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

export type GetGeoServerRoute = typeof getGeoServerLayers;
