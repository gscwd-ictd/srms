import { z } from "zod";
import {
  ErrorResponseSchema,
  FileFormSchema,
  HealthCheckResponseSchema,
  IdParamsSchema,
  QueryParamsSchema,
  ResultMetaDataSchema,
} from "../schemas/helperSchemas";
import { FeatureStylesSchema } from "@srms/lib/servicableareas/schemas";

export type PaginatedResult<T> = {
  data: T[];
  metadata: ResultMetada;
};

export type IdParams = z.infer<typeof IdParamsSchema>;
export type FileFormSchema = z.infer<typeof FileFormSchema>;
export type QueryParams = z.infer<typeof QueryParamsSchema>;
export type ResultMetada = z.infer<typeof ResultMetaDataSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;

export type FeatureStyles = z.infer<typeof FeatureStylesSchema>;
