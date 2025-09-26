"use client";

import { useState, type FunctionComponent, type PropsWithChildren } from "react";
import { MapManager } from "@srms/lib/mapstudio/mapManager";
import { FeatureStyles } from "@srms/server/types";
import { featureStylesDefault } from "@srms/server/constants/featureStylesDefault";
import { FleetMapContext } from "../features/fleetMap/contexts/useFleetMapContext";

const mapManager = new MapManager();

export const FleetMapProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [properties, setProperties] = useState<FeatureStyles>(featureStylesDefault);

  // const { data: pipelines, isLoading: loadingPipelines } = useQuery<PipelinesGeoJSON>({
  //   queryKey: ["get-all-pipelines"],
  //   refetchOnReconnect: false,
  //   refetchOnMount: false,
  //   refetchOnWindowFocus: false,
  //   queryFn: async () => {
  //     return (await $api.pipelines.getAllPipelines()) as unknown as PipelinesGeoJSON;
  //   },
  //   throwOnError: true,
  // });

  // const { data: waterMeters, isLoading: loadingWaterMeters } = useQuery<WaterMetersGeoJSON>({
  //   queryKey: ["get-all-water-meters"],
  //   refetchOnReconnect: false,
  //   refetchOnMount: false,
  //   refetchOnWindowFocus: false,
  //   queryFn: async () => {
  //     return (await $api.waterMeters.getAllWaterMetersGeoJson()) as unknown as WaterMetersGeoJSON;
  //   },
  //   throwOnError: true,
  // });

  return (
    <FleetMapContext.Provider
      value={{
        mapManager,
        properties,
        setProperties,
      }}
    >
      {children}
    </FleetMapContext.Provider>
  );
};
