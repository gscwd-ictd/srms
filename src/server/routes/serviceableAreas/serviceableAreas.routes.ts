import { createRoute, z } from "@hono/zod-openapi";
import { OpenAPIResponses } from "@srms/server/constants";
import * as HttpStatusCodes from "@srms/server/constants/httpStatusCodes";
import { IdParamsSchema, QueryParamsSchema, ResultMetaDataSchema } from "@srms/server/schemas";
import {
  CreateServiceableAreaSchema,
  SelectServiceableAreaSchema,
} from "@srms/server/schemas/tables/serviceableAreaSchema";

const TAGS = ["Serviceable Areas"];

export const createNewServiceableArea = createRoute({
  tags: TAGS,
  description: "Create a new serviceable area.",
  method: "post",
  path: "v1/serviceable-areas",
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
  },
});

export const getServiceableAreaById = createRoute({
  tags: TAGS,
  description: "Get serviceable area by ID.",
  method: "get",
  path: "v1/serviceable-areas/{id}",
  request: {
    params: IdParamsSchema,
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
  },
});

export const getAllServiceableAreas = createRoute({
  tags: TAGS,
  description: "Get all serviceable areas.",
  method: "get",
  path: "v1/serviceable-areas",
  request: {
    query: QueryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: z.object({
            data: z.array(SelectServiceableAreaSchema),
            metadata: ResultMetaDataSchema,
          }),
        },
      },
      description: OpenAPIResponses.OK,
    },
  },
});

export type CreateNewServiceableArea = typeof createNewServiceableArea;

export type GetServiceableAreaById = typeof getServiceableAreaById;

export type GetAllServiceableAreasRoute = typeof getAllServiceableAreas;
