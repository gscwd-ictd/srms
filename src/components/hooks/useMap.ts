"use-client";

import { ZoomSlider } from "ol/control";
import View from "ol/View";
import { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import { defaults as defaultControls } from "ol/control.js";
import { useMapStore } from "../stores/useMapStore";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

const useMap = () => {
  const [map, setMap] = useState<Map | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);

  const { viewport, setMapRef } = useMapStore();

  useEffect(() => {
    const olMap = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: "mainMap",
      view: new View({
        projection: viewport.projection,
        center: viewport.center,
        zoom: viewport.zoom,
        maxZoom: viewport.maxZoom,
        minZoom: viewport.minZoom,
        extent: viewport.extent,
      }),
      maxTilesLoading: 16,
      keyboardEventTarget: document,
      controls: defaultControls().extend([new ZoomSlider()]),
    });

    // Get coordinates when clicking on map
    olMap.on("click", (e) => {
      const coord = e.coordinate;

      console.log(coord);
    });

    // set the map ref in the global store
    // let the map to be used in other components
    setMapRef(olMap);

    // set the map state
    setMap(map);

    // on component unmount remove the map references to avoid unexpected behavior
    return () => {
      // remove the map when the component is unmounted
      olMap.setTarget(undefined);
    };
  }, [viewport, map, setMapRef]);

  return { map, mapRef };
};

export default useMap;
