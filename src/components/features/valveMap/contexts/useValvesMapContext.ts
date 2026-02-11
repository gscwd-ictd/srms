import { MapManager } from "@srms/lib/mapstudio/mapManager";
import { createContext, useContext } from "react";
import { FeatureStyles } from "@srms/server/types";
import { ValvesGeoJSON } from "@srms/lib/pms/types";

export type ValvesMapState = {
  mapManager: MapManager;
  properties: FeatureStyles;
  valves: ValvesGeoJSON;
  setProperties?: (styles: FeatureStyles) => void;
};

export const ValvesMapContext = createContext<ValvesMapState | undefined>(undefined);

export const useValvesMap = () => {
  const ValvesMap = useContext(ValvesMapContext);

  if (!ValvesMap) {
    throw new Error("Must be a child of ValvesMapContext");
  }

  return ValvesMap;
};
