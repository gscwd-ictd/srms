import { CreateServiceableArea, ServiceableArea } from "@srms/server/types";

export interface ServiceableAreasRepository {
  addServiceableArea(data: CreateServiceableArea): Promise<ServiceableArea>;
}
