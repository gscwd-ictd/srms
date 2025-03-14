import { z } from "zod";

export const ErrorResponseSchema = z.object({
  name: z.string().optional(),
  status: z.number(),
  message: z.string(),
  description: z.string().optional(),
  fields: z.record(z.string()).optional(),
  path: z.string().optional(),
  stack: z.string().optional(),
});

export const HealthCheckResponseSchema = z.object({
  status: z.literal("healthy").or(z.literal("unhealthy")),
  datetime: z.string(),
  version: z.string(),
  environment: z.string(),
  database: z.object({
    status: z.literal("up").or(z.literal("down")),
    responseTime: z.number(),
    connectionCount: z.number(),
    maxConnections: z.number(),
  }),
  uptime: z.string(),
  memory: z.object({
    used: z.number(),
    total: z.number(),
    free: z.number(),
  }),
});

export const yearSchema = z.object({
  year: z.coerce
    .number()
    .min(1000)
    .max(9999)
    .openapi({
      description: "Query the year ( where a column of an entity is applicable )",
      param: {
        name: "year",
        in: "path",
        required: true,
      },
      example: 2025,
      required: ["year"],
    }),
});

export const IdParamsSchema = z.object({
  id: z.string().openapi({
    param: {
      name: "id",
      in: "path",
      required: true,
    },
    required: ["id"],
    description: "The unique identifier of an entity you intend to operate on.",
    example: "cm6p7d5og0jbx7s65qcu",
  }),
});

export const QueryParamsSchema = z.object({
  limit: z.coerce
    .number()
    .default(10)
    .optional()
    .openapi({
      param: {
        name: "limit",
        required: false,
        in: "query",
      },
      default: 10,
      description: "The number of rows to retreive in a single fetch.",
    }),
  page: z.coerce
    .number()
    .default(1)
    .optional()
    .openapi({
      param: {
        name: "page",
        required: false,
        in: "query",
      },
      default: 1,
      description: "Page number of results to return.",
    }),
});

export const ResultMetaDataSchema = z.object({
  currentPageCount: z.number(),
  totalRowCount: z.number(),
  currentPage: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});
