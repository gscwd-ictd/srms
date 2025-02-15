"use client";

import { useState, type FunctionComponent, type PropsWithChildren } from "react";
import { MapManager } from "@srms/lib/mapstudio/mapManager";
import { FeatureStyles } from "../features/addServiceableArea/ServiceableAreaMap";
import { ServiceableAreaMapContext } from "../features/addServiceableArea/contexts/useServiceableMapContext";

const mapManager = new MapManager();

export const ServiceableAreaMapProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [properties, setProperties] = useState<FeatureStyles>({
    fillColor: "rgb(197, 202, 233, 0.4)",
    strokeColor: "rgb(79, 70, 229, 1.0)",
    strokeWidth: [3],
    outlineStyle: "solid",
    freehand: false,
    enableSnapping: true,
    snapTolerance: [7],
    snapToEdge: true,
    snapToVertex: true,
  });

  return (
    <ServiceableAreaMapContext.Provider value={{ mapManager, properties, setProperties }}>
      {children}
    </ServiceableAreaMapContext.Provider>
  );
};
