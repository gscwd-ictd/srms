"use client";

import { type FunctionComponent } from "react";
import useMap from "@srms/components/hooks/useMap";
import BaseLayerPicker from "./BaseLayerPicker";
import VehicleToggleList from "./VehicleToggleList";
import { Token } from "@srms/components/types";

// import { TracksolidTokens } from "@srms/components/types";

interface TsTokensProps {
  accessToken: Token;
}

const MapComponent: FunctionComponent<TsTokensProps> = ({ accessToken }) => {
  const map = useMap();

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
