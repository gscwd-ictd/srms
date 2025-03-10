import { Application, CreateApplication } from "../../types";

export interface I_ApplicantionRepository {
  addApplication(data: CreateApplication): Promise<Application>;
}
