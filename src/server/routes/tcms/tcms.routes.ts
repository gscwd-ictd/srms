import { createRoute } from "@hono/zod-openapi";
import { TAGS } from "@srms/utils/constants";
import * as HttpStatusCodes from "@srms/utils/httpStatusCodes";
import { ErrorResponseSchema } from "@srms/server/schemas/helperSchemas";
import {
  AccountParam,
  AccountYearParam,
  AccountYearParam2,
  SelectConsumer,
  SelectConsumerLedger,
  SelectConsumerLedgerEntry,
  SelectConsumerServiceRequests,
} from "@srms/lib/tcms/schemas";
import { OpenAPIResponses } from "@srms/server/constants/openApiResponses";

export const getConsumer = createRoute({
  tags: TAGS.CONSUMER,
  description: "GET ALL DETAILS OF CONSUMER",
  method: "get",
  path: "/v1/consumer/information/{accountNo}",
  operationId: "getConsumer",

  request: {
    params: AccountParam,
  },

  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectConsumer,
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
            message: "Consumer not found",
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

export const getAllConsumerServiceRequest = createRoute({
  tags: TAGS.CONSUMER,
  description: "GET ALL THE CONSUMER'S SERVICE REQUEST FOR SPECIFIC YEAR",
  method: "get",
  path: "/v1/consumer/service-request",
  operationId: "getAllConsumerService",

  request: {
    query: AccountYearParam,
  },

  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectConsumerServiceRequests,
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
            message: "Consumer service request not found",
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

export const getAllConsumerLedger = createRoute({
  tags: TAGS.CONSUMER,
  description: "GET ALL THE CONSUMER'S LEDGER FOR SPECIFIC YEAR",
  method: "get",
  path: "/v1/consumer/ledger",
  operationId: "getAllConsumerLedger",

  request: {
    query: AccountYearParam,
  },

  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectConsumerLedger,
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
            message: "Consumer ledger not found",
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

export const getConsumerLedgerLastEntry = createRoute({
  tags: TAGS.CONSUMER,
  description: "GET CONSUMER'S LAST LEDGER ENTRY FOR A SPECIFIC YEAR",
  method: "get",
  path: "/v1/consumer/last-ledger-entry",
  operationId: "getConsumerLedgerLastEntry",

  request: {
    query: AccountYearParam2,
  },

  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectConsumerLedgerEntry,
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
            message: "Consumer ledger last entry not found",
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

export type GetConsumerRoute = typeof getConsumer;
export type GetAllConsumerServiceRequestRoute = typeof getAllConsumerServiceRequest;
export type GetAllConsumerLedgerRoute = typeof getAllConsumerLedger;
export type GetConsumerLedgerLastEntryRoute = typeof getConsumerLedgerLastEntry;
