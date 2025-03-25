import { createRoute, z } from "@hono/zod-openapi";
import {
  createFixtureUnitsSchema,
  selectFixtureUnitsSchema,
  updateFixtureUnitsSchema,
} from "@srms/lib/nsa/schemas";
import {
  ErrorResponseSchema,
  FileFormSchema,
  IdParamsSchema,
  yearSchema,
} from "@srms/server/schemas/helperSchemas";
import { TAGS } from "@srms/utils/constants";
import * as HttpStatusCodes from "@srms/utils/httpStatusCodes";

export const addFixtureUnit = createRoute({
  tags: TAGS.FIXTURE_UNITS,
  description: "Add Fixture Units",
  method: "post",
  path: "/v1/fixture-units",
  operationId: "addFixtureUnit",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createFixtureUnitsSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.CREATED]: {
      content: {
        "application/json": {
          schema: selectFixtureUnitsSchema,
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

export const addFixtureUnitsByFile = createRoute({
  tags: TAGS.FIXTURE_UNITS,
  description: "Add Fixture Units",
  method: "post",
  path: "/v1/fixture-units/csv",
  operationId: "addFixtureUnitsByFile",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: FileFormSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.CREATED]: {
      content: {
        "application/json": {
          schema: z.array(z.object({})),
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

export const updateFixtureUnit = createRoute({
  tags: TAGS.FIXTURE_UNITS,
  description: "Update Fixture Unit",
  method: "put",
  path: "/v1/fixture-units",
  operationId: "updateFixtureUnit",
  request: {
    body: {
      content: {
        "application/json": {
          schema: updateFixtureUnitsSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: selectFixtureUnitsSchema,
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

export const getFixtureUnitsByYear = createRoute({
  tags: TAGS.FIXTURE_UNITS,
  description: "Get Fixture Units by year",
  method: "get",
  path: "/v1/fixture-units/{year}",
  operationId: "getFixtureUnitsByYear",
  request: {
    params: yearSchema,
  },
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

export const getFixtureUnitById = createRoute({
  tags: TAGS.FIXTURE_UNITS,
  description: "Get Fixture Unit By Id",
  method: "get",
  path: "/v1/fixture-units/single/{id}",
  operationId: "getFixtureUnitsByYear",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: selectFixtureUnitsSchema,
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
            message: "Fixture Unit not found!",
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

export const deleteFixtureUnitById = createRoute({
  tags: TAGS.FIXTURE_UNITS,
  description: "Delete Fixture Unit By Id",
  method: "delete",
  path: "/v1/fixture-units/{id}",
  operationId: "deleteFixtureUnitsByYear",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: selectFixtureUnitsSchema,
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
            message: "Fixture Unit not found!",
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

export type AddFixtureUnitRoute = typeof addFixtureUnit;
export type AddFixtureUnitsByFileRoute = typeof addFixtureUnitsByFile;
export type GetFixtureUnitsByYearRoute = typeof getFixtureUnitsByYear;
export type UpdateFixtureUnitRoute = typeof updateFixtureUnit;
export type GetFixtureUnitByIdRoute = typeof getFixtureUnitById;
export type DeleteFixtureUnitByIdRoute = typeof deleteFixtureUnitById;
