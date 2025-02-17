import { MapManager } from "@srms/lib/mapstudio/mapManager";
import { FeatureStyles } from "../ServiceableAreaMap";
import { createContext, useContext } from "react";
import { ServiceableAreaGeoJSON } from "@srms/server/types";

export type ServiceableAreaMapState = {
  mapManager: MapManager;
  properties: FeatureStyles;
  serviceableAreas: ServiceableAreaGeoJSON[];
  setProperties?: (styles: FeatureStyles) => void;
};

export const ServiceableAreaMapContext = createContext<ServiceableAreaMapState | undefined>(undefined);

export const useServiceableAreaMap = () => {
  const serviceableAreaMap = useContext(ServiceableAreaMapContext);

  if (!serviceableAreaMap) {
    throw new Error("Must be a child of ServiceableAreaMapContext");
  }

  return serviceableAreaMap;
};
