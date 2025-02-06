import { createRoute, z } from "@hono/zod-openapi";
import { ApplicationStatus } from "@nsa/server/constants";
import { errorDescriptions } from "@nsa/server/constants/errorDescriptions";
import * as HttpStatusCodes from "@nsa/server/constants/httpStatusCodes";
import {
  ErrorResponseSchema,
  IdParamsSchema,
  CreateApplicantsSchema,
  CreateApplicationsSchema,
  SelectApplicationDetailsSchema,
  QueryParamsSchema,
  ResultMetaDataSchema,
  SelectApplicationsSchema,
} from "@nsa/server/schemas";

export const createNewApplication = createRoute({
  tags: ["Applications"],
  description: "Create an application for new service connection.",
  method: "post",
  path: "/v1/applications",
  operationId: "createNewApplication",
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
  operationId: "getApplicationDetailsById",
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
            name: "NotFoundError",
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
  description: "Get all application details. The retrieved result contains a paginated data.",
  operationId: "getAllApplicationDetails",
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

export const updateApplicationStatus = createRoute({
  tags: ["Applications"],
  method: "patch",
  path: "/v1/applications/status/{id}",
  description: "Update application status.",
  operationId: "updateApplicationStatus",
  request: {
    params: IdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: z.object({
            status: z.enum(ApplicationStatus).openapi({
              description: "The updated status of an application.",
            }),
          }),
        },
      },
      required: true,
    },
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectApplicationsSchema,
        },
      },
      description: errorDescriptions.OK,
    },

    [HttpStatusCodes.NOT_FOUND]: {
      content: {
        "application/json": {
          example: {
            name: "NotFoundError",
            status: 404,
            message: "Update failed. Application not found!",
          },
          schema: ErrorResponseSchema,
        },
      },
      description: errorDescriptions["Not Found"],
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

export type UpdateApplicationStatusRoute = typeof updateApplicationStatus;
