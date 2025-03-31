import { ServiceableArea } from "../../types";

export interface I_ServiceableAreaRepository {
  getAllServiceableAreas(): Promise<ServiceableArea[]>;
}
