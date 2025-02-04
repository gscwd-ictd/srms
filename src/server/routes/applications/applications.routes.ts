import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "@nsa/server/constants/httpStatusCodes";
import { ErrorResponseSchema } from "@nsa/server/helpers/errors/jsonError";
import { IdParamsSchema, openApiErrorDescriptions } from "@nsa/server/helpers/openapi";
import { CreateApplicantsSchema } from "@nsa/server/validations/applicantSchema";
import {
  CreateApplicationsSchema,
  SelectApplicationDetailsSchema,
} from "@nsa/server/validations/applicationSchema";

export const createNewApplication = createRoute({
  tags: ["Applications"],
  description: "Create a new application for new service connection.",
  method: "post",
  path: "/v1/applications",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            details: CreateApplicationsSchema,
            applicant: CreateApplicantsSchema,
          }),
        },
      },
      required: true,
    },
  },
  responses: {
    // Status: Ok
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectApplicationDetailsSchema,
        },
      },
      description: openApiErrorDescriptions.OK,
    },

    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: openApiErrorDescriptions["Unprocessable Entity"],
    },

    [HttpStatusCodes.BAD_REQUEST]: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: openApiErrorDescriptions["Bad Request"],
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
      description: openApiErrorDescriptions["Internal Server Error"],
    },
  },
});

export const getApplicationDetailsByApplicationId = createRoute({
  tags: ["Applications"],
  description: "Get application details by passing in application_id.",
  method: "get",
  path: "/v1/applications/{id}",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectApplicationDetailsSchema,
        },
      },
      description: openApiErrorDescriptions.OK,
    },

    [HttpStatusCodes.NOT_FOUND]: {
      content: {
        "application/json": {
          example: {
            name: "NotFounError",
            status: 404,
            message: "Application details not found!",
          },
          schema: ErrorResponseSchema,
        },
      },
      description: openApiErrorDescriptions["Not Found"],
    },
  },
});

export type CreateApplicationRoute = typeof createNewApplication;

export type GetApplicationDetailsByApplicationIdRoute = typeof getApplicationDetailsByApplicationId;
