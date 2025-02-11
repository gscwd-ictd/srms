import { createRoute, z } from "@hono/zod-openapi";
import { OpenAPIResponses } from "@srms/server/constants";
import * as HttpStatusCodes from "@srms/server/constants/httpStatusCodes";
import { IdParamsSchema } from "@srms/server/schemas";
import {
  CreateServiceableAreaSchema,
  SelectServiceableAreaGeoJSONSchema,
  SelectServiceableAreaSchema,
} from "@srms/server/schemas/tables/serviceableAreaSchema";

const TAGS = ["Serviceable Areas"];

export const addServiceableArea = createRoute({
  tags: TAGS,
  description: "This is the description for serviceable areas post route.",
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

export const getAllServiceableAreas = createRoute({
  tags: TAGS,
  description: "Get all serviceable areas.",
  method: "get",
  path: "v1/serviceable-areas",
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: z.array(SelectServiceableAreaGeoJSONSchema),
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
          schema: SelectServiceableAreaGeoJSONSchema,
        },
      },
      description: OpenAPIResponses.OK,
    },
  },
});

export type AddServiceableAreaRoute = typeof addServiceableArea;

export type GetAllServiceableAreasRoute = typeof getAllServiceableAreas;

export type GetServiceableAreaByIdRoute = typeof getServiceableAreaById;
