import {} from "@nsa/server/db/schemas";
import { CreateApplicantsSchema } from "@nsa/server/validations/applicantSchema";
import {
  CreateApplicationsSchema,
  SelectApplicationDetailsSchema,
} from "@nsa/server/validations/applicationSchema";
import { z } from "zod";

export interface ApplicationRepository {
  createApplication(
    details: z.infer<typeof CreateApplicationsSchema>,
    applicant: z.infer<typeof CreateApplicantsSchema>,
  ): Promise<z.infer<typeof SelectApplicationDetailsSchema>>;

  getApplicationDetailsById(id: string): Promise<z.infer<typeof SelectApplicationDetailsSchema>>;
}
