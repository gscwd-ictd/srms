import { createRoute, z } from "@hono/zod-openapi";
import { errorDescriptions } from "@nsa/server/constants/errorDescriptions";
import { ErrorResponseSchema } from "@nsa/server/helpers/errors/jsonError";
import { IdParamsSchema } from "@nsa/server/schemas";
import { CreateApplicantsSchema } from "@nsa/server/schemas/applicantSchema";
import {
  CreateApplicationsSchema,
  SelectApplicationDetailsSchema,
} from "@nsa/server/schemas/applicationSchema";
import * as HttpStatusCodes from "@nsa/server/constants/httpStatusCodes";
import { QueryParamsSchema } from "@nsa/server/schemas/queryParams";
import { ResultMetaDataSchema } from "@nsa/server/schemas/resultMetadataSchema";

export const createNewApplication = createRoute({
  tags: ["Applications"],
  description: "Create an application for new service connection.",
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
      description: errorDescriptions.OK,
    },

    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: errorDescriptions["Unprocessable Entity"],
    },

    [HttpStatusCodes.BAD_REQUEST]: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: errorDescriptions["Bad Request"],
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
      description: errorDescriptions["Internal Server Error"],
    },
  },
});

export const getApplicationDetailsById = createRoute({
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
      description: errorDescriptions.OK,
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
      description: errorDescriptions["Not Found"],
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
      description: errorDescriptions["Internal Server Error"],
    },
  },
});

export const getAllApplicationDetails = createRoute({
  tags: ["Applications"],
  method: "get",
  path: "/v1/applications",
  request: {
    query: QueryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: z.object({
            data: z.array(SelectApplicationDetailsSchema),
            metadata: ResultMetaDataSchema,
          }),
        },
      },
      description: errorDescriptions.OK,
    },

    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: errorDescriptions["Unprocessable Entity"],
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
      description: errorDescriptions["Internal Server Error"],
    },
  },
});

export type CreateApplicationRoute = typeof createNewApplication;

export type GetApplicationDetailsByIdRoute = typeof getApplicationDetailsById;

export type GetAllApplicationDetailsRoute = typeof getAllApplicationDetails;
