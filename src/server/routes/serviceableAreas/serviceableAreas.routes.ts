import { createRoute, z } from "@hono/zod-openapi";
import {
  CreateServiceableAreaSchema,
  SelectServiceableAreaGeoJSONSchema,
  SelectServiceableAreaSchema,
} from "@srms/lib/servicableareas/schemas/ServiceableAreaSchema";
import { OpenAPIResponses } from "@srms/server/constants/openApiResponses";
import { ErrorResponseSchema, IdParamsSchema } from "@srms/server/schemas/helperSchemas";
import * as HttpStatusCodes from "@srms/utils/httpStatusCodes";

const TAGS = ["Serviceable Areas"];

export const addServiceableArea = createRoute({
  tags: TAGS,
  description: "Add new serviceable area.",
  method: "post",
  path: "v1/serviceable-areas",
  operationId: "addServiceableArea",
  deprecated: true,
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateServiceableAreaSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectServiceableAreaSchema,
        },
      },
      description: OpenAPIResponses.OK,
    },

    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: OpenAPIResponses.UNPROCESSABLE_ENTITY,
    },

    [HttpStatusCodes.BAD_REQUEST]: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: OpenAPIResponses.BAD_REQUEST,
    },

    // Status: Internal Server Error
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

export const getAllServiceableAreas = createRoute({
  tags: TAGS,
  description: "Get all serviceable areas.",
  method: "get",
  path: "v1/serviceable-areas",
  operationId: "getAllServiceableAreas",
  deprecated: true,
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: z.array(SelectServiceableAreaGeoJSONSchema),
        },
      },
      description: OpenAPIResponses.OK,
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

export const getServiceableAreaById = createRoute({
  tags: TAGS,
  description: "Get serviceable area by ID.",
  method: "get",
  path: "v1/serviceable-areas/{id}",
  operationId: "getServiceableAreaById",
  deprecated: true,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectServiceableAreaGeoJSONSchema,
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
            message: "Application details not found!",
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

export type AddServiceableAreaRoute = typeof addServiceableArea;
export type GetAllServiceableAreasRoute = typeof getAllServiceableAreas;
export type GetServiceableAreaByIdRoute = typeof getServiceableAreaById;
