import { I_ServiceableAreaRepository, I_ServiceableAreaService } from "../interfaces";
import { ServiceableArea } from "../types";

export class ServiceableAreaService implements I_ServiceableAreaService {
  constructor(private readonly repository: I_ServiceableAreaRepository) {}

  async getAllServiceableAreas(): Promise<ServiceableArea[]> {
    return await this.repository.getAllServiceableAreas();
  }
}
