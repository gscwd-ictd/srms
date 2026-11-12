import { MapManager } from "@srms/lib/mapstudio/mapManager";
import { createContext, useContext } from "react";
import { FeatureStyles } from "@srms/server/types";
import Feature from "ol/Feature";

export type AnnotationsMapState = {
  mapManager: MapManager;

  properties: FeatureStyles;
  setProperties?: (styles: FeatureStyles) => void;

  // NEW
  selectAnnotation: (feature: Feature) => void;
  registerSelectAnnotation?: (fn: (feature: Feature) => void) => void;
};

export const AnnotationsMapContext = createContext<AnnotationsMapState | undefined>(undefined);

export const useAnnotationsMap = () => {
  const annotationsMap = useContext(AnnotationsMapContext);

  if (!annotationsMap) {
    throw new Error("Must be a child of AnnotationsMapContext");
  }

  return annotationsMap;
};
