"use client";

import { type MapManager } from "@srms/lib/mapstudio/mapManager";
import { createContext, useContext } from "react";

type MapContextState = {
  mapManager: MapManager;
};

export const MapContext = createContext<MapContextState | undefined>(undefined);

export const useMap = () => {
  const mapContext = useContext(MapContext);

  if (!mapContext) {
    throw new Error("Must be a child of MapProvider!");
  }

  return mapContext;
};
