import { CreateServiceableArea, ServiceableArea, ServiceableAreaGeoJSON } from "@srms/server/types";

export interface ServiceableAreasRepository {
  addServiceableArea(data: CreateServiceableArea): Promise<ServiceableArea>;
  getAllServiceableAreas(): Promise<ServiceableAreaGeoJSON[]>;
  getServiceableAreaById(id: string): Promise<ServiceableAreaGeoJSON>;
}
