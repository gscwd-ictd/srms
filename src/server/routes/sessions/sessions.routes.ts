import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "@srms/utils/httpStatusCodes";

export const setOdicParams = createRoute({
  tags: ["Sessions"],
  method: "post",
  path: "/v1/sessions",
  request: {
    // body: {
    //   content: {
    //     "application/json": {
    //       schema: z.object({
    //         codeVerifier: z.string().optional(),
    //         state: z.string().optional(),
    //         nonce: z.string().optional(),
    //       }),
    //     },
    //   },
    // },
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: z.object({
            url: z.string().url(),
          }),
        },
      },
      description: "",
    },
  },
});

export type SetOIDCParams = typeof setOdicParams;
