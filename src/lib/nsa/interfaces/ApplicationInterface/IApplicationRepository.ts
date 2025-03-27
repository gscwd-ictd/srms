import { PaginatedResult, QueryParams } from "@srms/server/types/helperTypes";
import { ApplicantDocs, Application, CreateApplication, UploadApplicationDocs } from "../../types";

export interface I_ApplicantionRepository {
  getAllApplication(queryParams?: QueryParams): Promise<PaginatedResult<Application>>;
  addApplication(data: CreateApplication): Promise<Application>;
  getApplicationById(id: string): Promise<Application>;
  uploadApplicationDocs(data: UploadApplicationDocs): Promise<ApplicantDocs>;
}
