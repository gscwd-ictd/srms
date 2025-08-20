"use client";

import { useState, type FunctionComponent, type PropsWithChildren } from "react";
import { MapManager } from "@srms/lib/mapstudio/mapManager";
import { useQuery } from "@tanstack/react-query";
import $api from "@srms/lib/sdk/apiClient";
import { FeatureStyles } from "@srms/server/types";
import { featureStylesDefault } from "@srms/server/constants/featureStylesDefault";
import { PipelinesGeoJSON } from "@srms/lib/pms/types";
import { FleetMapContext } from "../features/fleetMap/contexts/useFleetMapContext";

const mapManager = new MapManager();

export const FleetMapProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [properties, setProperties] = useState<FeatureStyles>(featureStylesDefault);

  const { data: pipelines } = useQuery<PipelinesGeoJSON>({
    queryKey: ["get-all-pipelines"],
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      return (await $api.pipelines.getAllPipelines()) as unknown as PipelinesGeoJSON;
    },
    throwOnError: true,
  });

  if (pipelines) {
    return (
      <FleetMapContext.Provider value={{ mapManager, properties, pipelines, setProperties }}>
        {children}
      </FleetMapContext.Provider>
    );
  }
};
