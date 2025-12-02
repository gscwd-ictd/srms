/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { type PropsWithChildren, type FunctionComponent, useRef, useEffect } from "react";
import { useGeographic } from "ol/proj";
import View from "ol/View";
import { BaseMapLayerGroup } from "./BaseMapLayerGroup";
import { useAdminMonitMap } from "./contexts/useAdminMonitMapContext";
import { useMapStore } from "@srms/components/stores/useMapStore";
// import { useSidebar } from "@srms/components/ui/Sidebar";

export const AdminMonitMap: FunctionComponent<PropsWithChildren> = ({ children }) => {
  // const { setOpen } = useSidebar();

  /**
   * Calling the useGeographic function makes it so the map view uses
   * geographic coordinates (even if the view projection is not geographic).
   *
   * See more at: https://openlayers.org/en/latest/apidoc/module-ol_proj.html#.useGeographic
   */
  useGeographic();

  const adminMonitMap = useAdminMonitMap();

  const mapRef = useRef<HTMLDivElement>(null);

  const { viewport } = useMapStore();

  useEffect(() => {
    // // By default in this page, sidebar is closed
    // setOpen(false);

    if (!mapRef.current) return;

    adminMonitMap.mapManager.init({
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

    // adminMonitMap.mapManager.getMap().on("click", (e) => {
    //   const coord = e.coordinate;
    //   console.log(coord);
    // });

    return () => {
      adminMonitMap.mapManager.destroy();
      mapRef.current = null;
    };
  }, [adminMonitMap.mapManager]);

  return (
    <div ref={mapRef} className="relative z-20 h-full w-full">
      {children}
    </div>
  );
};
