import { ApplicationStatus } from "@nsa/server/constants";
import {
  Application,
  ApplicationDetails,
  CreateApplicant,
  CreateApplication,
  PaginatedResult,
  QueryParams,
} from "@nsa/server/types";

export interface ApplicationRepository {
  createApplication(details: CreateApplication, applicant: CreateApplicant): Promise<ApplicationDetails>;

  getApplicationDetailsById(id: string): Promise<ApplicationDetails>;

  getAllApplicationDetails<T>(query?: QueryParams): Promise<PaginatedResult<T[]>>;

  updateApplicationStatus(
    applicationId: string,
    status: (typeof ApplicationStatus)[number],
  ): Promise<Application>;
}
