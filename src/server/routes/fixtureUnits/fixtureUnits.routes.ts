import { createRoute, z } from "@hono/zod-openapi";
import { createFixtureUnitsSchema, selectFixtureUnitsSchema } from "@srms/server/db/schemas";
import { ErrorResponseSchema, yearSchema } from "@srms/server/schemas/helperSchemas";
import { TAGS } from "@srms/utils/constants";
import * as HttpStatusCodes from "@srms/utils/httpStatusCodes";

export const addFixtureUnit = createRoute({
  tags: ["ADD_FIXTURE_UNIT"],
  description: "ADD FIXTURE UNIT",
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

export type AddFixtureUnitRoute = typeof addFixtureUnit;
export type GetFixtureUnitsByYearRoute = typeof getFixtureUnitsByYear;
