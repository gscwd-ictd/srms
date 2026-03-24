/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { type PropsWithChildren, type FunctionComponent, useRef, useEffect } from "react";
import { useGeographic } from "ol/proj";
import View from "ol/View";
import { BaseMapLayerGroup } from "./BaseMapLayerGroup";
import { useFleetMap } from "./contexts/useFleetMapContext";
// import { useSidebar } from "@srms/components/ui/Sidebar";

export const FleetMap: FunctionComponent<PropsWithChildren> = ({ children }) => {
  // const { setOpen } = useSidebar();

  /**
   * Calling the useGeographic function makes it so the map view uses
   * geographic coordinates (even if the view projection is not geographic).
   *
   * See more at: https://openlayers.org/en/latest/apidoc/module-ol_proj.html#.useGeographic
   */
  useGeographic();

  const fleetMap = useFleetMap();

  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // // By default in this page, sidebar is closed
    // setOpen(false);

    if (!mapRef.current) return;

    fleetMap.mapManager.init({
      layers: [BaseMapLayerGroup],
      target: mapRef.current,
      view: new View({
        projection: "EPSG:4326",
        center: [125.17189194375173, 6.113035811082611],
        zoom: 16,
        maxZoom: 25,
        minZoom: 12,
        showFullExtent: true,
      }),
    });

    return () => {
      fleetMap.mapManager.destroy();
      mapRef.current = null;
    };
  }, [fleetMap.mapManager]);

  return (
    <div ref={mapRef} className="h-full w-full">
      {children}
    </div>
  );
};
