import { createRoute, z } from "@hono/zod-openapi";
import { TAGS } from "@srms/utils/constants";
import * as HttpStatusCodes from "@srms/utils/httpStatusCodes";
import { ErrorResponseSchema } from "@srms/server/schemas/helperSchemas";
import { SelectAccessTokenSchema, SelectRefreshTokenSchema } from "@srms/lib/tracksolid/schemas";

export const getTsAccessToken = createRoute({
  tags: TAGS.TRACKSOLID,
  description: "Get access token from Tracksolid server",
  method: "post",
  path: "/v1/tracksolid/access_token",
  operationId: "getTsAccessToken",
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectAccessTokenSchema,
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
            message: "Access token not found",
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

export const getTsRefreshToken = createRoute({
  tags: TAGS.TRACKSOLID,
  description: "Get refresh token from Tracksolid server",
  method: "post",
  path: "/v1/tracksolid/refresh_token",
  operationId: "getTsRefreshToken",
  // request: {
  //   body: {
  //     content: {
  //       "application/json": {
  //         schema: {
  //           accessToken: z.string(),
  //           refreshToken: z.string(),
  //         },
  //       },
  //     },
  //   },
  // },
  request: {
    headers: z.object({
      "access-token": z.string(),
      "refresh-token": z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectRefreshTokenSchema,
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
            message: "Refresh token not found",
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

export type GetTsAccessTokenRoute = typeof getTsAccessToken;
export type GetTsRefreshTokenRoute = typeof getTsRefreshToken;
