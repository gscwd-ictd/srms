"use client";

import { MapManager } from "@srms/lib/mapstudio/mapManager";
import { defaults as defaultInteractions } from "ol/interaction";
import { View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import {
  type PropsWithChildren,
  type FunctionComponent,
  useRef,
  useEffect,
  useState,
  createContext,
} from "react";

type WebMapProps = PropsWithChildren & {};

export const WebMapContext = createContext<MapManager | undefined>(undefined);

export const WebMap: FunctionComponent<WebMapProps> = ({ children }) => {
  const [mapManager, setMapManager] = useState<MapManager>();

  const mapRef = useRef<HTMLDivElement>(null);

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
        center: [0, 0],
        zoom: 2,
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
    <div ref={mapRef} className="h-full w-full">
      <WebMapContext.Provider value={mapManager}>{children}</WebMapContext.Provider>
    </div>
  );
};
