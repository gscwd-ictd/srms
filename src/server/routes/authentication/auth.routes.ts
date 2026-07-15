import { createRoute } from "@hono/zod-openapi";
import { TAGS } from "@srms/utils/constants";
import * as HttpStatusCodes from "@srms/utils/httpStatusCodes";
import { ErrorResponseSchema } from "@srms/server/schemas/helperSchemas";
import { RoleAbilitySchema } from "@srms/lib/authentication/schemas";

export const getUserRoles = createRoute({
  tags: TAGS.AUTHENTICATION,
  description: "Get user roles from decoding JWT",
  method: "get",
  path: "/v1/user-roles",
  operationId: "getUserRoles",
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: RoleAbilitySchema,
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
            message: "User roles not found",
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
export type GetUserRolesRoute = typeof getUserRoles;
