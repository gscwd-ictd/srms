"use client";

import { type PropsWithChildren, type FunctionComponent, useRef, useEffect } from "react";
import { useGeographic } from "ol/proj";
import { useServiceableAreaMap } from "./contexts/useServiceableMapContext";
import View from "ol/View";

export const ServiceableAreaMap: FunctionComponent<PropsWithChildren> = ({ children }) => {
  /**
   * Calling the useGeographic function makes it so the map view uses
   * geographic coordinates (even if the view projection is not geographic).
   *
   * See more at: https://openlayers.org/en/latest/apidoc/module-ol_proj.html#.useGeographic
   */
  useGeographic();

  const serviceableAreaMap = useServiceableAreaMap();

  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    serviceableAreaMap.mapManager.init({
      target: mapRef.current,
      view: new View({
        projection: "EPSG:4326",
        center: [125.17189194375173, 6.113035811082611],
        zoom: 16,
      }),
    });

    return () => {
      serviceableAreaMap.mapManager.destroy();
      mapRef.current = null;
    };
  }, [serviceableAreaMap.mapManager]);

  return (
    <div ref={mapRef} className="relative z-20 h-full w-full">
      {children}
    </div>
  );
};
