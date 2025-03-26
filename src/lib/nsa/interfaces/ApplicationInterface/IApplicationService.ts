import { PaginatedResult, QueryParams } from "@srms/server/types/helperTypes";
import { ApplicantDocs, Application, CreateApplication, UploadApplicationDocs } from "../../types";

export interface I_ApplicantionService {
  getAllApplication(queryParams?: QueryParams): Promise<PaginatedResult<Application>>;
  addApplication(data: CreateApplication): Promise<Application>;
  uploadApplicationDocs(data: UploadApplicationDocs): Promise<ApplicantDocs>;
}
