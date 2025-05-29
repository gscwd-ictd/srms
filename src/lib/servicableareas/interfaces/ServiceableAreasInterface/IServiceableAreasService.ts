import { CreateServiceableArea, ServiceableArea, ServiceableAreaGeoJSON } from "../../types";

export interface I_ServicableAreasService {
  addServiceableArea(data: CreateServiceableArea): Promise<ServiceableArea>;
  getAllServiceableAreas(): Promise<ServiceableAreaGeoJSON[]>;
  getServiceableAreaById(id: string): Promise<ServiceableAreaGeoJSON>;
}
