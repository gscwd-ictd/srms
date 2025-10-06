import { createRoute } from "@hono/zod-openapi";
import { TAGS } from "@srms/utils/constants";
import * as HttpStatusCodes from "@srms/utils/httpStatusCodes";
import { ErrorResponseSchema } from "@srms/server/schemas/helperSchemas";
import {
  LoggerFilterBody,
  SelectLoggerChannelEntry,
  SelectLoggersListData,
  SelectPipelinesGeoJSONSchema,
  SelectValvesGeoJSONSchema,
} from "@srms/lib/pms/schemas";
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

export const getPipelinesGeoJson = createRoute({
  tags: TAGS.PRESSURE_MANAGEMENT,
  description: "Get pipelines data",
  method: "get",
  path: "/v1/layers/pipelines",
  operationId: "getPipelinesGeoJson",
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectPipelinesGeoJSONSchema,
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

export const getLoggersList = createRoute({
  tags: TAGS.PRESSURE_MANAGEMENT,
  description: "Get data loggers list. From XilogApi. https://github.com/Ovarro/XilogApiDocs",
  method: "get",
  path: "/v1/layers/iot-loggers",
  operationId: "getLoggersList",
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectLoggersListData,
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

export const getLoggerChannelEntries = createRoute({
  tags: TAGS.PRESSURE_MANAGEMENT,
  description:
    "Get loggers data based on channel set. With date from and to. From XilogApi. https://github.com/Ovarro/XilogApiDocs",
  method: "post",
  path: "/v1/iot-logger/entries",
  operationId: "getLoggerChannelEntries",
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoggerFilterBody,
        },
      },
    },
  },

  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectLoggerChannelEntry,
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
            message: "Logger entries not found",
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

export type GetValvesGeoJsonRoute = typeof getValvesGeoJson;
export type GetPipelinesGeoJsonRoute = typeof getPipelinesGeoJson;
export type GetLoggersListRoute = typeof getLoggersList;
export type GetLoggerChannelEntriesRoute = typeof getLoggerChannelEntries;
