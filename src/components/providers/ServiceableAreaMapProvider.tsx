"use client";

import { useState, type FunctionComponent, type PropsWithChildren } from "react";
import { MapManager } from "@srms/lib/mapstudio/mapManager";
import { ServiceableAreaMapContext } from "../features/addServiceableArea/contexts/useServiceableMapContext";
import { useQuery } from "@tanstack/react-query";
import $api from "@srms/lib/sdk/apiClient";
// @ts-expect-error ServiceableAreaGeoJSON has already been removed
import { FeatureStyles, ServiceableAreaGeoJSON } from "@srms/server/types";
import { featureStylesDefault } from "@srms/utils/constants";

const mapManager = new MapManager();

export const ServiceableAreaMapProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [properties, setProperties] = useState<FeatureStyles>(featureStylesDefault);

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
