import { z } from "zod";

export const ResultMetaDataSchema = z.object({
  currentPageCount: z.number(),
  totalRowCount: z.number(),
  currentPage: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});
