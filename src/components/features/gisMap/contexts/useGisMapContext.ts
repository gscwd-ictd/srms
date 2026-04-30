import { MapManager } from "@srms/lib/mapstudio/mapManager";
import { createContext, useContext } from "react";
import { FeatureStyles } from "@srms/server/types";

export type GisMapState = {
  mapManager: MapManager;
  properties: FeatureStyles;
  setProperties?: (styles: FeatureStyles) => void;
};

export const GisMapContext = createContext<GisMapState | undefined>(undefined);

export const useGisMap = () => {
  const GisMap = useContext(GisMapContext);

  if (!GisMap) {
    throw new Error("Must be a child of GisMapContext");
  }

  return GisMap;
};
