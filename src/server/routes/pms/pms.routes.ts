import { createRoute } from "@hono/zod-openapi";
import { TAGS } from "@srms/utils/constants";
import * as HttpStatusCodes from "@srms/utils/httpStatusCodes";
import { ErrorResponseSchema } from "@srms/server/schemas/helperSchemas";
import {
  LatestLoggerEntryFilterSchema,
  LatestMultilogEntryFilterSchema,
  LoggerFilterBody,
  SelectLoggerChannelEntry,
  SelectLoggersListData,
  SelectMultilogLoggers,
  SelectPipelinesGeoJSONSchema,
  SelectValvesGeoJSONSchema,
  SelectReservoirsGeoJSONSchema,
  SelectPumpingStationsGeoJSONSchema,
  SelectBarangayGeoJSONSchema,
  SelectHydrantGeoJSONSchema,
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

export const getXilogLoggersList = createRoute({
  tags: TAGS.PRESSURE_MANAGEMENT,
  description: "Get data loggers list. From XilogApi. https://github.com/Ovarro/XilogApiDocs",
  method: "get",
  path: "/v1/layers/xilog-iot-loggers",
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

export const getXilogLoggerChannelEntries = createRoute({
  tags: TAGS.PRESSURE_MANAGEMENT,
  description:
    "Get loggers data based on channel set. With date from and to. From XilogApi. https://github.com/Ovarro/XilogApiDocs",
  method: "post",
  path: "/v1/xilog-iot-logger/entries",
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

export const getXilogChannelLatestEntries = createRoute({
  tags: TAGS.PRESSURE_MANAGEMENT,
  description:
    "Get latest(current time : previous 1 min) logger data based on channel set. From XilogApi. https://github.com/Ovarro/XilogApiDocs",
  method: "get",
  path: "/v1/xilog-iot-logger/entries/latest/{serialNumber}/{channel}",
  operationId: "getChannelLatestEntries",
  request: {
    params: LatestLoggerEntryFilterSchema,
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

export const getMultilogLoggersList = createRoute({
  tags: TAGS.PRESSURE_MANAGEMENT,
  description: "Get data loggers list. From Multilog TZE innov API.",
  method: "get",
  path: "/v1/layers/multilog-iot-loggers",
  operationId: "getMultilogLoggersList",

  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectMultilogLoggers,
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

export const getMultilogChannelLatestEntry = createRoute({
  tags: TAGS.PRESSURE_MANAGEMENT,
  description: "Get single multilog logger details.",
  method: "get",
  path: "/v1/multilog-iot-loggers/entry/latest/{serialNumber}",
  operationId: "getMultilogLoggerLatestEntries",

  request: {
    params: LatestMultilogEntryFilterSchema,
  },

  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectMultilogLoggers,
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

export const getReservoirsGeoJson = createRoute({
  tags: TAGS.PRESSURE_MANAGEMENT,
  description: "Get reservoirs data",
  method: "get",
  path: "/v1/layers/reservoirs",
  operationId: "getReservoirsGeoJson",

  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectReservoirsGeoJSONSchema,
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
            message: "Reservoirs not found",
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

export const getPumpingStationsGeoJson = createRoute({
  tags: TAGS.PRESSURE_MANAGEMENT,
  description: "Get pumping stations data",
  method: "get",
  path: "/v1/layers/pumping-stations",
  operationId: "getPumpingStationsGeoJson",
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectPumpingStationsGeoJSONSchema,
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
            message: "Pumping stations not found",
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

export const getHydrantsGeoJson = createRoute({
  tags: TAGS.PRESSURE_MANAGEMENT,
  description: "Get hydrants data",
  method: "get",
  path: "/v1/layers/hydrants",
  operationId: "getHydrantsGeoJson",

  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectHydrantGeoJSONSchema,
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
            message: "Hydrants not found",
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

export const getBarangaysGeoJson = createRoute({
  tags: TAGS.PRESSURE_MANAGEMENT,
  description: "Get barangays data",
  method: "get",
  path: "/v1/layers/barangays",
  operationId: "getBarangaysGeoJson",

  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectBarangayGeoJSONSchema,
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
            message: "Barangays not found",
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
export type GetXilogLoggersListRoute = typeof getXilogLoggersList;
export type GetXilogLoggerChannelEntriesRoute = typeof getXilogLoggerChannelEntries;
export type GetXilogChannelLatestEntriesRoute = typeof getXilogChannelLatestEntries;
export type GetMultilogLoggersListRoute = typeof getMultilogLoggersList;
export type GetMultilogChannelLatestEntryRoute = typeof getMultilogChannelLatestEntry;
export type GetReservoirsGeoJsonRoute = typeof getReservoirsGeoJson;
export type GetPumpingStationsGeoJsonRoute = typeof getPumpingStationsGeoJson;
export type GetHydrantsGeoJsonRoute = typeof getHydrantsGeoJson;
export type GetBarangaysGeoJsonRoute = typeof getBarangaysGeoJson;
