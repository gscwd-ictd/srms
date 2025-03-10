import { Application, CreateApplication } from "../../types";

export interface I_ApplicantionService {
  addApplication(data: CreateApplication): Promise<Application>;
}
