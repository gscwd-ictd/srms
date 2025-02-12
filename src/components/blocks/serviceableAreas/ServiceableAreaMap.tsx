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

export const WebMapContext = createContext<MapManager | undefined>(undefined);

export const ServiceableAreaMap: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [mapManager, setMapManager] = useState<MapManager>();

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
      <WebMapContext.Provider value={mapManager}>{children}</WebMapContext.Provider>
    </div>
  );
};
