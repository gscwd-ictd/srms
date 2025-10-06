import { MapManager } from "@srms/lib/mapstudio/mapManager";
import { createContext, useContext } from "react";
import { FeatureStyles } from "@srms/server/types";

export type AdminMonitMapState = {
  mapManager: MapManager;
  properties: FeatureStyles;
  setProperties?: (styles: FeatureStyles) => void;
};

export const AdminMonitMapContext = createContext<AdminMonitMapState | undefined>(undefined);

export const useAdminMonitMap = () => {
  const AdminMonitMap = useContext(AdminMonitMapContext);

  if (!AdminMonitMap) {
    throw new Error("Must be a child of AdminMonitMapContext");
  }

  return AdminMonitMap;
};
