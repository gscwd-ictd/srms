import { z } from "zod";
import { IdParamsSchema, QueryParamsSchema, ResultMetaDataSchema, ErrorResponseSchema } from "../schemas";

export type PaginatedResult<T> = {
  data: T[];
  metadata: ResultMetada;
};

export type IdParams = z.infer<typeof IdParamsSchema>;
export type QueryParams = z.infer<typeof QueryParamsSchema>;
export type ResultMetada = z.infer<typeof ResultMetaDataSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
