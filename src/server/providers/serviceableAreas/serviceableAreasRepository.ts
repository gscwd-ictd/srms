import { CreateServiceableArea, PaginatedResult, ServiceableArea } from "@srms/server/types";

export interface ServiceableAreasRepository {
  addServiceableArea(data: CreateServiceableArea): Promise<ServiceableArea>;
  getServiceableAreaById(id: string): Promise<ServiceableArea>;
  getAllServiceableAreas(): Promise<PaginatedResult<ServiceableArea>>;
}
