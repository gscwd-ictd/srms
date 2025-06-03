"use client";

import { useEffect, type FunctionComponent } from "react";
import useMap from "@srms/components/hooks/useMap";
import BaseLayerPicker from "./BaseLayerPicker";
import VehicleToggleList from "./VehicleToggleList";
import { Token } from "@srms/components/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMapStore } from "@srms/components/stores/useMapStore";
import TileLayer from "ol/layer/Tile";
import { TileWMS } from "ol/source";

// import { TracksolidTokens } from "@srms/components/types";

interface TsTokensProps {
  accessToken: Token;
}

const MapComponent: FunctionComponent<TsTokensProps> = ({ accessToken }) => {
  const map = useMap();

  // zustand initialization
  const { mapRef } = useMapStore();

  // env values
  const geoserverUrl = process.env.NEXT_PUBLIC_GEOSERVER_URL;
  const geoserverWorkspace = process.env.NEXT_PUBLIC_GEOSERVER_WORKSPACE;

  // Get pipeline layer and add to zustand store
  const { data, isSuccess } = useQuery({
    queryKey: ["pipeline-layer"],
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/layers/pipeline-layer`);

      const tileLayer = new TileLayer({
        source: new TileWMS({
          attributions: "@geoserver",
          url: `${geoserverUrl}/${geoserverWorkspace}/wms?`,
          params: {
            LAYERS: `${geoserverWorkspace}:${data.name}`,
          },
        }),
        visible: true,
        preload: Infinity,
        className: `${data.name}`,
      });

      return tileLayer;
    },
    throwOnError: true,
  });

  // add to layer to map
  useEffect(() => {
    if (isSuccess) {
      mapRef?.addLayer(data);
    }
  }, [isSuccess, data]);

  if (!map) {
    return <>Empty Map</>;
  }

  return (
    <>
      <BaseLayerPicker />

      <VehicleToggleList accessToken={accessToken} />

      <div tabIndex={-1} id="mainMap" className="h-full w-full" />
    </>
  );
};

export default MapComponent;
