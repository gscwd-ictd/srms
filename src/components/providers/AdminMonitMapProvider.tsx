"use client";

import { useState, type FunctionComponent, type PropsWithChildren } from "react";
import { MapManager } from "@srms/lib/mapstudio/mapManager";
import { FeatureStyles } from "@srms/server/types";
import { featureStylesDefault } from "@srms/server/constants/featureStylesDefault";
import { AdminMonitMapContext } from "../features/adminMap/contexts/useAdminMonitMapContext";

const mapManager = new MapManager();

export const AdminMonitMapProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [properties, setProperties] = useState<FeatureStyles>(featureStylesDefault);

  return (
    <AdminMonitMapContext.Provider
      value={{
        mapManager,
        properties,
        setProperties,
      }}
    >
      {children}
    </AdminMonitMapContext.Provider>
  );
};
