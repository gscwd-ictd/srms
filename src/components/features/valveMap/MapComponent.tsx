"use client";

import { type FunctionComponent } from "react";
import useMap from "@srms/components/hooks/useMap";
import BaseLayerPicker from "./BaseLayerPicker";

const MapComponent: FunctionComponent = () => {
  const map = useMap();

  if (!map) {
    return <>Empty Map</>;
  }

  return (
    <>
      <BaseLayerPicker />

      <div tabIndex={-1} id="mainMap" className="h-full w-full" />
    </>
  );
};

export default MapComponent;
