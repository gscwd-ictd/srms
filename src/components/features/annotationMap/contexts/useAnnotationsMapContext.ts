import { MapManager } from "@srms/lib/mapstudio/mapManager";
import { createContext, useContext } from "react";
import { FeatureStyles } from "@srms/server/types";

export type AnnotationsMapState = {
  mapManager: MapManager;
  properties: FeatureStyles;
  setProperties?: (styles: FeatureStyles) => void;
};

export const AnnotationsMapContext = createContext<AnnotationsMapState | undefined>(undefined);

export const useAnnotationsMap = () => {
  const AnnotationsMap = useContext(AnnotationsMapContext);

  if (!AnnotationsMap) {
    throw new Error("Must be a child of AnnotationsMapContext");
  }

  return AnnotationsMap;
};
