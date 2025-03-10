import { I_ApplicantionRepository, I_ApplicantionService } from "../interfaces";
import { Application, CreateApplication } from "../types";

export class ApplicationService implements I_ApplicantionService {
  constructor(private readonly repository: I_ApplicantionRepository) {}

  async addApplication(data: CreateApplication): Promise<Application> {
    return await this.repository.addApplication(data);
  }
}
