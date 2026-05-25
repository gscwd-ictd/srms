"use client";

import { useState, type FunctionComponent, type PropsWithChildren } from "react";
import { MapManager } from "@srms/lib/mapstudio/mapManager";
import { FeatureStyles } from "@srms/server/types";
import { featureStylesDefault } from "@srms/server/constants/featureStylesDefault";
import { AnnotationsMapContext } from "../features/annotationMap/contexts/useAnnotationsMapContext";

const mapManager = new MapManager();

export const AnnotationsMapProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [properties, setProperties] = useState<FeatureStyles>(featureStylesDefault);

  return (
    <AnnotationsMapContext.Provider
      value={{
        mapManager,
        properties,
        setProperties,
      }}
    >
      {children}
    </AnnotationsMapContext.Provider>
  );
};
