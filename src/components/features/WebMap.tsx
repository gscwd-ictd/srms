"use client";

import { MapStudio } from "@srms/lib/mapstudio/MapStudio";
import { defaults as defaultInteractions } from "ol/interaction";
import { FunctionComponent, RefObject, useEffect, useRef, useState } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import View from "ol/View";
import { Coordinate } from "ol/coordinate";

export const WebMap: FunctionComponent = () => {
  const [mapStudio, setMapStudio] = useState<MapStudio>();
  const mapRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement | null>;
  const [coord, setCoord] = useState<number[]>();
  const [coords, setCoords] = useState<Coordinate[] | undefined>();

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new MapStudio({
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

    const initializedMap = map.initialize();

    map.onClick((coordinates) => {
      console.log("Clicked coordinates:", coordinates);
      setCoord(coordinates);
    });

    setMapStudio(initializedMap);

    return () => {
      map.destroy();
    };
  }, []);

  const toggleDrawing = () => {
    if (!mapStudio) return;

    if (mapStudio.isDrawing()) {
      mapStudio.stopDrawing();
    } else {
      mapStudio.startDrawing((coords) => {
        setCoords(coords);
        console.log(coords);
        //onPolygonComplete(coords);
      });
    }
  };

  const handleCheckBoundary = () => {
    const isInside = mapStudio?.isCoordinateInPolygon(coord ?? [], coords ?? []);
    console.log(isInside);
  };

  return (
    <div ref={mapRef} className="absolute bottom-0 top-0 h-full w-full">
      <button
        onClick={toggleDrawing}
        className="absolute right-4 top-4 z-50 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        {mapStudio?.isDrawing() ? "Cancel Drawing" : "Draw Polygon"}
      </button>

      <button
        onClick={handleCheckBoundary}
        className="absolute right-4 top-32 z-50 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Check Boundary
      </button>
    </div>
  );
};
