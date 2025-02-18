"use client";

import { MapManager } from "@srms/lib/mapstudio/mapManager";
import { type FunctionComponent, type PropsWithChildren } from "react";
import { MapContext } from "../contexts/useMapContext";

const mapManager = new MapManager();

export const MapProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return <MapContext.Provider value={{ mapManager }}>{children}</MapContext.Provider>;
};
