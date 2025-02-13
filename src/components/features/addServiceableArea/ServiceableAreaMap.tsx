"use client";

import { MapManager } from "@srms/lib/mapstudio/mapManager";
import { defaults as defaultInteractions } from "ol/interaction";
import { useGeographic } from "ol/proj";
import { OSM } from "ol/source";
import { type PropsWithChildren, type FunctionComponent, useState, useRef, useEffect } from "react";
import { ServiceableAreaMapContext } from "./contexts/useServiceableMapContext";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import { MapToolbar } from "./MapToolbar";

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

    const map = mapManager.init({
      target: mapRef.current,

      controls: [],

      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],

      view: new View({
        projection: "EPSG:4326",
        center: [125.17189194375173, 6.113035811082611],
        zoom: 16,
      }),

      interactions: defaultInteractions({
        doubleClickZoom: true,
        dragPan: true,
        mouseWheelZoom: true,
      }),
    });

    map.getMap().renderSync();

    setMapManager(map);

    return () => {
      map.destroy();
      mapRef.current = null;
    };
  }, []);

  return (
    <div ref={mapRef} className="relative z-20 h-full w-full">
      <ServiceableAreaMapContext.Provider value={{ mapManager, properties, setProperties }}>
        <MapToolbar />
        {children}
      </ServiceableAreaMapContext.Provider>
    </div>
  );
};
