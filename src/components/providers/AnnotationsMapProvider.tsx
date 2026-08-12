"use client";

import { MapManager } from "@srms/lib/mapstudio/mapManager";
import { featureStylesDefault } from "@srms/server/constants/featureStylesDefault";
import { AnnotationsMapContext } from "../features/annotationMap/contexts/useAnnotationsMapContext";
import { useRef, useState } from "react";
import Feature from "ol/Feature";

const mapManager = new MapManager();

export const AnnotationsMapProvider = ({ children }) => {
  const [properties, setProperties] = useState(featureStylesDefault);

  const selectAnnotationRef = useRef<(feature: Feature) => void>(() => {});

  return (
    <AnnotationsMapContext.Provider
      value={{
        mapManager,
        properties,
        setProperties,

        selectAnnotation: (feature) => {
          selectAnnotationRef.current(feature);
        },

        registerSelectAnnotation: (fn) => {
          selectAnnotationRef.current = fn;
        },
      }}
    >
      {children}
    </AnnotationsMapContext.Provider>
  );
};
