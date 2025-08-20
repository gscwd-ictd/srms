import { MapManager } from "@srms/lib/mapstudio/mapManager";
import { createContext, useContext } from "react";
import { FeatureStyles } from "@srms/server/types";
import { PipelinesGeoJSON } from "@srms/lib/pms/types";

export type FleetMapState = {
  mapManager: MapManager;
  properties: FeatureStyles;
  pipelines: PipelinesGeoJSON;
  setProperties?: (styles: FeatureStyles) => void;
};

export const FleetMapContext = createContext<FleetMapState | undefined>(undefined);

export const useFleetMap = () => {
  const FleetMap = useContext(FleetMapContext);

  if (!FleetMap) {
    throw new Error("Must be a child of FleetMapContext");
  }

  return FleetMap;
};
