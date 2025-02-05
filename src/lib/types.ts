import {
  CreateApplicantsSchema,
  CreateApplicationsSchema,
  SelectApplicationDetailsSchema,
} from "@nsa/server/schemas";
import { QueryParamsSchema, ResultMetaDataSchema } from "@nsa/server/schemas";

import { z } from "zod";

export type QueryParams = z.infer<typeof QueryParamsSchema>;

export type PaginatedResult<T> = {
  data: T[];
  metadata: z.infer<typeof ResultMetaDataSchema>;
};

export type CreateApplication = z.infer<typeof CreateApplicationsSchema>;
export type CreateApplicant = z.infer<typeof CreateApplicantsSchema>;
export type ApplicationDetails = z.infer<typeof SelectApplicationDetailsSchema>;
