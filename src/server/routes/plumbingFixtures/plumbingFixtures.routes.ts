import { createRoute, z } from "@hono/zod-openapi";
import {
  CreatePlumbingFixtureSchema,
  SelectPlumbingFixtureSchema,
  UpdatePlumbingFixtureSchema,
} from "@srms/server/db/schemas";
import { ErrorResponseSchema, IdParamsSchema } from "@srms/server/schemas/helperSchemas";
import { TAGS } from "@srms/utils/constants";

import * as HttpStatusCodes from "@srms/utils/httpStatusCodes";

export const getAllPlumbingFixtures = createRoute({
  tags: TAGS.PLUMBING_FIXTURES,
  description: "GET ALL PLUMBING FIXTURES",
  method: "get",
  path: "v1/plumbing-fixtures",
  operationId: "getAllPlumbingFixtures",
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: z.array(SelectPlumbingFixtureSchema),
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

export const addPlumbingFixture = createRoute({
  tags: TAGS.PLUMBING_FIXTURES,
  description: "ADD PLUMBING FIXTURE",
  method: "post",
  path: "v1/plumbing-fixtures",
  operationId: "addPlumbingFixture",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: CreatePlumbingFixtureSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectPlumbingFixtureSchema,
        },
      },
      description: "",
    },

    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "",
    },

    [HttpStatusCodes.BAD_REQUEST]: {
      content: {
        "application/json": {
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

export const getPlumbingFixtureById = createRoute({
  tags: TAGS.PLUMBING_FIXTURES,
  description: "GET PLUMBING FIXTURE BY ID",
  method: "get",
  path: "v1/plumbing-fixtures/{id}",
  operationId: "getPlumbingFixtureById",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectPlumbingFixtureSchema,
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
            message: "Plumbing fixture not found!",
            stack: "...",
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

export const updatePlumbingFixtureById = createRoute({
  tags: TAGS.PLUMBING_FIXTURES,
  method: "put",
  path: "v1/plumbing-fixtures/{id}",
  description: "UPDATE PLUMBING FIXTURE BY ID.",
  operationId: "updatePlumbingFixtureById",
  request: {
    params: IdParamsSchema,
    body: {
      content: {
        "multipart/form-data": {
          schema: UpdatePlumbingFixtureSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectPlumbingFixtureSchema,
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
            message: "Update failed. Plumbing fixture not found!",
          },
          schema: ErrorResponseSchema,
        },
      },
      description: "",
    },

    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "",
    },

    [HttpStatusCodes.BAD_REQUEST]: {
      content: {
        "application/json": {
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

export const deletePlumbingFixtureById = createRoute({
  tags: TAGS.PLUMBING_FIXTURES,
  description: "DELETE PLUMBING FIXTURE BY ID",
  method: "delete",
  path: "v1/plumbing-fixtures/{id}",
  operationId: "deletePlumbingFixtureById",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectPlumbingFixtureSchema,
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
            message: "Plumbing fixture not found!",
            stack: "...",
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

export type AddPlumbingFixtureRoute = typeof addPlumbingFixture;
export type GetAllPlumbingFixturesRoute = typeof getAllPlumbingFixtures;
export type GetPlumbingFixtureById = typeof getPlumbingFixtureById;
export type UpdatePlumbingFixtureById = typeof updatePlumbingFixtureById;
export type DeletePlumbingFixtureById = typeof deletePlumbingFixtureById;
