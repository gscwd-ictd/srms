import { createRoute, z } from "@hono/zod-openapi";
import { errorDescriptions } from "@nsa/server/constants";
import { ErrorResponseSchema, HealthCheckResponseSchema } from "@nsa/server/schemas";
import { rateLimiter } from "hono-rate-limiter";
import * as HttpStatusCodes from "@nsa/server/constants/httpStatusCodes";
import * as HttpStatusPhrases from "@nsa/server/constants/httpStatusPhrases";

export const getServerStatus = createRoute({
  tags: ["Utilities"],
  summary: "/api/v1/healthcheck",
  description:
    "Check for server's health status. This route is not protected, hence a rate limiter is implemented to avoid spam requests.",
  method: "get",
  path: "/v1/healthcheck",
  middleware: [
    rateLimiter({
      keyGenerator: (c) => c.req.header("x-forwarded-for") ?? "",
      windowMs: 60000, // 1 minute
      limit: 5,
      message: {
        status: HttpStatusCodes.TOO_MANY_REQUESTS,
        message: HttpStatusPhrases.TOO_MANY_REQUESTS,
        description: "You have exceeded your maximum allowable requests for this route.",
      } as z.infer<typeof ErrorResponseSchema>,
    }),
  ],
  responses: {
    // Status: Ok
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          example: {
            status: "healthy",
            datetime: "Thursday, February 6th 2025, 10:51:20 AM GMT+8",
            version: "0.1.0",
            environment: "development",
            database: {
              status: "up",
              responseTime: 11,
              connectionCount: 1,
              maxConnections: 100,
            },
            uptime: "3 minutes",
            memory: {
              used: 103,
              total: 122,
              free: 19,
            },
          },
          schema: HealthCheckResponseSchema,
        },
      },
      description: errorDescriptions["OK"],
    },

    // Status: Too Many Requests
    [HttpStatusCodes.TOO_MANY_REQUESTS]: {
      content: {
        "application/json": {
          example: {
            status: 429,
            message: HttpStatusPhrases.TOO_MANY_REQUESTS,
            description: "You have exceeded your maximum allowable requests for this route.",
          },
          schema: ErrorResponseSchema,
        },
      },
      description: errorDescriptions["Too Many Requests"],
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

export type GetServerStatusRoute = typeof getServerStatus;
