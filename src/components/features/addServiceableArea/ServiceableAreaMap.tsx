"use client";

import { MapManager } from "@srms/lib/mapstudio/mapManager";
import { defaults as defaultInteractions } from "ol/interaction";
import TileLayer from "ol/layer/Tile";
import { useGeographic } from "ol/proj";
import { OSM } from "ol/source";
import View from "ol/View";
import {
  type PropsWithChildren,
  type FunctionComponent,
  useState,
  useRef,
  useEffect,
  createContext,
} from "react";

export type FeatureProperties = {
  fillColor: string;
  strokeColor: string;
  strokeWidth: number[];
  outlineStyle: "solid" | "dashed";
  enableSnapping: boolean;
  snapTolerance: [number];
  snapToEdge: boolean;
  snapTpVertex: boolean;
};

export type ServiceableAreaMapState = {
  mapManager: MapManager | undefined;
  properties: FeatureProperties;
  setProperties?: (val: FeatureProperties) => void;
};

export const ServiceableAreaMapContenxt = createContext<ServiceableAreaMapState | undefined>(undefined);

export const ServiceableAreaMap: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [mapManager, setMapManager] = useState<MapManager>();

  const [properties, setProperties] = useState<FeatureProperties>({
    fillColor: "rgb(197, 202, 233, 0.4)",
    strokeColor: "rgb(79, 70, 229, 1.0)",
    strokeWidth: [3],
    outlineStyle: "solid",
    enableSnapping: true,
    snapTolerance: [1],
    snapToEdge: true,
    snapTpVertex: true,
  });

  const mapRef = useRef<HTMLDivElement>(null);

  /**
   * Calling the useGeographic function makes it so the map view uses
   * geographic coordinates (even if the view projection is not geographic).
   *
   * See more at: https://openlayers.org/en/latest/apidoc/module-ol_proj.html#.useGeographic
   */
  useGeographic();

  useEffect(() => {
    if (!mapRef.current) return;

    const manager = new MapManager();

    const map = manager.init({
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
      <ServiceableAreaMapContenxt.Provider value={{ mapManager, properties, setProperties }}>
        {children}
      </ServiceableAreaMapContenxt.Provider>
    </div>
  );
};
