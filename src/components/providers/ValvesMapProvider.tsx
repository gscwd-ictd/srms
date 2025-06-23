"use client";

import { useState, type FunctionComponent, type PropsWithChildren } from "react";
import { MapManager } from "@srms/lib/mapstudio/mapManager";
import { useQuery } from "@tanstack/react-query";
import $api from "@srms/lib/sdk/apiClient";
import { FeatureStyles } from "@srms/server/types";
import { featureStylesDefault } from "@srms/server/constants/featureStylesDefault";
import { ValvesGeoJSON } from "@srms/lib/pms/types";
import { ValvesMapContext } from "../features/valveMap/contexts/useValvesMapContext";
const mapManager = new MapManager();

export const ValvesMapProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [properties, setProperties] = useState<FeatureStyles>(featureStylesDefault);

  const { data: valves } = useQuery<ValvesGeoJSON>({
    queryKey: ["get-all-valves"],
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      return (await $api.valves.getAllValves()) as unknown as ValvesGeoJSON;
    },
    throwOnError: true,
  });

  if (valves) {
    return (
      <ValvesMapContext.Provider value={{ mapManager, properties, valves, setProperties }}>
        {children}
      </ValvesMapContext.Provider>
    );
  }
};
