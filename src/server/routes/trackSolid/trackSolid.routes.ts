import { createRoute, z } from "@hono/zod-openapi";
import { TAGS } from "@srms/utils/constants";
import * as HttpStatusCodes from "@srms/utils/httpStatusCodes";
import { ErrorResponseSchema } from "@srms/server/schemas/helperSchemas";
import {
  SelectAccessTokenSchema,
  SelectRefreshTokenSchema,
  SelectDeviceDetailSchema,
  SelectDevicesSchema,
  SelectDevicesLocationSchema,
  SelectImeisSchema,
  SelectDevicesMileageSchema,
  SelectMileageSchema,
  ErrorRefreshTokenSchema,
} from "@srms/lib/tracksolid/schemas";

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
  //   headers: z.object({
  //     tsAccessToken: z.string(),
  //     tsRefreshToken: z.string(),
  //   }),
  // },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectRefreshTokenSchema,
        },
      },
      description: "",
    },

    [HttpStatusCodes.UNAUTHORIZED]: {
      content: {
        "application/json": {
          schema: ErrorRefreshTokenSchema,
          example: {
            error: true,
            message: "Missing Tracksolid authentication cookies.",
          },
        },
      },
      description: "Authentication cookies are missing or invalid",
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

export const getDevices = createRoute({
  tags: TAGS.TRACKSOLID,
  description: "Query all devices of a specified account",
  method: "post",
  path: "/v1/tracksolid/devices",
  operationId: "getDevices",
  request: {
    headers: z.object({
      "access-token": z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectDevicesSchema,
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
            message: "Devices for account not found",
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

export const getDeviceDetail = createRoute({
  tags: TAGS.TRACKSOLID,
  description: "Get device detail information for specific IMEI",
  method: "post",
  path: "/v1/tracksolid/device-detail",
  operationId: "getDeviceDetail",
  request: {
    headers: z.object({
      "access-token": z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: SelectMileageSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectDeviceDetailSchema,
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
            message: "Device not found",
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

export const getDevicesLocation = createRoute({
  tags: TAGS.TRACKSOLID,
  description: "Get the latest location for one or multiple devices.",
  method: "post",
  path: "/v1/tracksolid/devices-location",
  operationId: "getDevicesLocation",
  request: {
    headers: z.object({
      "access-token": z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: SelectImeisSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectDevicesLocationSchema,
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
            message: "Device/s not found",
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

export const getDevicesMileage = createRoute({
  tags: TAGS.TRACKSOLID,
  description: "Get device(s) mileage data of specified time range.",
  method: "post",
  path: "/v1/tracksolid/devices-mileage",
  operationId: "getDevicesMileage",
  request: {
    headers: z.object({
      "access-token": z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: SelectMileageSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: SelectDevicesMileageSchema,
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
            message: "Device/s not found",
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
export type GetDevicesRoute = typeof getDevices;
export type GetDeviceDetailRoute = typeof getDeviceDetail;
export type GetDevicesLocationRoute = typeof getDevicesLocation;
export type GetDevicesMileageRoute = typeof getDevicesMileage;
