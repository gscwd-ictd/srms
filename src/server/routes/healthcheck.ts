import { createRoute, z } from "@hono/zod-openapi";
import { rateLimiter } from "hono-rate-limiter";
import { createOpenAPIRoute } from "@nsa/server/helpers/openapi";
import { ErrorResponseSchema } from "@nsa/server/helpers/errors/jsonError";
import { errorDescriptions } from "@nsa/server/constants/errorDescriptions";
import * as HttpStatusCodes from "@nsa/server/constants/httpStatusCodes";
import * as HttpStatusPhrases from "@nsa/server/constants/httpStatusPhrases";

const healthcheck = createOpenAPIRoute().openapi(
  // Open API docs
  createRoute({
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
              status: 200,
              message: "Ok",
            },
            schema: z.object({
              status: z.number(),
              message: z.string(),
            }),
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
  }),

  // Implementation
  (c) => {
    // throw new ServerError("Soweeee!");
    return c.json({ status: HttpStatusCodes.OK, message: "Ok" }, HttpStatusCodes.OK);
  },
);

export default healthcheck;
