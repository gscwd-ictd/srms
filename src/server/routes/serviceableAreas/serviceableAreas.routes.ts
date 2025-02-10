import { createRoute } from "@hono/zod-openapi";
import { OpenAPIResponses } from "@srms/server/constants";
import * as HttpStatusCodes from "@srms/server/constants/httpStatusCodes";
import {
  CreateServiceableAreaSchema,
  SelectServiceableAreaSchema,
} from "@srms/server/schemas/tables/serviceableAreaSchema";

export const createNewServiceableArea = createRoute({
  tags: ["Serviceable Areas"],
  description: "This is the description for serviceable areas post route.",
  method: "post",
  path: "v1/serviceable-areas",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateServiceableAreaSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectServiceableAreaSchema,
        },
      },
      description: OpenAPIResponses.OK,
    },
  },
});

export type CreateNewServiceableArea = typeof createNewServiceableArea;
