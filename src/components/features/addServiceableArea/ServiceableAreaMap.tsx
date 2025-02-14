"use client";

import { MapManager } from "@srms/lib/mapstudio/mapManager";
import { useGeographic } from "ol/proj";
import { type PropsWithChildren, type FunctionComponent, useState, useRef, useEffect } from "react";
import { ServiceableAreaMapContext } from "./contexts/useServiceableMapContext";
import View from "ol/View";
import { MapToolbar } from "./MapToolbar";
// import { LayersSidebar } from "./LayersSidebar";

export type FeatureStyles = {
  fillColor: string;
  strokeColor: string;
  strokeWidth: number[];
  outlineStyle: "solid" | "dashed";
  freehand: boolean;
  enableSnapping: boolean;
  snapTolerance: number[];
  snapToEdge: boolean;
  snapToVertex: boolean;
};

export const ServiceableAreaMap: FunctionComponent<PropsWithChildren> = ({ children }) => {
  /**
   * Calling the useGeographic function makes it so the map view uses
   * geographic coordinates (even if the view projection is not geographic).
   *
   * See more at: https://openlayers.org/en/latest/apidoc/module-ol_proj.html#.useGeographic
   */
  useGeographic();

  const [mapManager, setMapManager] = useState<MapManager>(new MapManager());

  const mapRef = useRef<HTMLDivElement>(null);

  const [properties, setProperties] = useState<FeatureStyles>({
    fillColor: "rgb(197, 202, 233, 0.4)",
    strokeColor: "rgb(79, 70, 229, 1.0)",
    strokeWidth: [3],
    outlineStyle: "solid",
    freehand: false,
    enableSnapping: true,
    snapTolerance: [7],
    snapToEdge: true,
    snapToVertex: true,
  });

  useEffect(() => {
    if (!mapRef.current) return;

    setMapManager(
      mapManager.init({
        target: mapRef.current,

        view: new View({
          projection: "EPSG:4326",
          center: [125.17189194375173, 6.113035811082611],
          zoom: 16,
        }),
      }),
    );

    return () => {
      mapManager.destroy();
      mapRef.current = null;
    };
  }, [mapManager]);

  return (
    <div ref={mapRef} className="relative z-20 h-full w-full">
      <ServiceableAreaMapContext.Provider value={{ mapManager, properties, setProperties }}>
        <MapToolbar />
        {/* <LayersSidebar /> */}

        {children}
      </ServiceableAreaMapContext.Provider>
    </div>
  );
};
