/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { type PropsWithChildren, type FunctionComponent, useRef, useEffect } from "react";
import { useGeographic } from "ol/proj";
import View from "ol/View";
import { BaseMapLayerGroup } from "./BaseMapLayerGroup";
import { useGisMap } from "./contexts/useGisMapContext";
import { useMapStore } from "@srms/components/stores/useMapStore";
// import { useSidebar } from "@srms/components/ui/Sidebar";

export const GisMap: FunctionComponent<PropsWithChildren> = ({ children }) => {
  // const { setOpen } = useSidebar();

  /**
   * Calling the useGeographic function makes it so the map view uses
   * geographic coordinates (even if the view projection is not geographic).
   *
   * See more at: https://openlayers.org/en/latest/apidoc/module-ol_proj.html#.useGeographic
   */
  useGeographic();

  const gisMap = useGisMap();

  const { viewport } = useMapStore();

  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // // By default in this page, sidebar is closed
    // setOpen(false);

    if (!mapRef.current) return;

    gisMap.mapManager.init({
      layers: [BaseMapLayerGroup],
      target: mapRef.current,
      view: new View({
        projection: viewport.projection,
        center: viewport.center,
        zoom: viewport.zoom,
        extent: viewport.extent,
        maxZoom: viewport.maxZoom,
        minZoom: viewport.minZoom,
      }),
    });

    return () => {
      gisMap.mapManager.destroy();
      mapRef.current = null;
    };
  }, [gisMap.mapManager]);

  return (
    <div ref={mapRef} className="relative z-20 h-full w-full">
      {children}
    </div>
  );
};
