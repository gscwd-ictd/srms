import { PaginatedResult, QueryParams } from "@srms/server/types/helperTypes";
import { Application, CreateApplication } from "../../types";

export interface I_ApplicantionRepository {
  getAllApplication(queryParams?: QueryParams): Promise<PaginatedResult<Application>>;
  addApplication(data: CreateApplication): Promise<Application>;
}
