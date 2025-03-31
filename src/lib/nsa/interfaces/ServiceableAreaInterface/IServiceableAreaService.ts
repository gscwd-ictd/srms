import { ServiceableArea } from "../../types";

export interface I_ServiceableAreaService {
  getAllServiceableAreas(): Promise<ServiceableArea[]>;
}
