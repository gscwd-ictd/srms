"use client";

import { useState, type FunctionComponent, type PropsWithChildren } from "react";
import { MapManager } from "@srms/lib/mapstudio/mapManager";
import { FeatureStyles } from "../features/addServiceableArea/ServiceableAreaMap";
import { ServiceableAreaMapContext } from "../features/addServiceableArea/contexts/useServiceableMapContext";
import { useQuery } from "@tanstack/react-query";
import $api from "@srms/lib/sdk/apiClient";
import { ServiceableAreaGeoJSON } from "@srms/server/types";

const mapManager = new MapManager();

export const featureStyleDefaults: FeatureStyles = {
  fillColor: "rgb(197, 202, 233, 0.4)",
  strokeColor: "rgb(79, 70, 229, 1.0)",
  strokeWidth: [3],
  outlineStyle: "solid",
  freehand: false,
  enableSnapping: true,
  snapTolerance: [7],
  snapToEdge: true,
  snapToVertex: true,
};

export const ServiceableAreaMapProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [properties, setProperties] = useState<FeatureStyles>(featureStyleDefaults);

  const { data: serviceableAreas } = useQuery<ServiceableAreaGeoJSON[]>({
    queryKey: ["get-all-serviceable-areas"],
    queryFn: async () => {
      return (await $api.serviceableAreas.getAllServiceableAreas()) as unknown as ServiceableAreaGeoJSON[];
    },
  });

  if (serviceableAreas) {
    return (
      <ServiceableAreaMapContext.Provider value={{ mapManager, properties, serviceableAreas, setProperties }}>
        {children}
      </ServiceableAreaMapContext.Provider>
    );
  }
};
