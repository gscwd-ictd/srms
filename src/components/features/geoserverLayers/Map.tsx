"use client";

import { useEffect, useRef, useState, type FunctionComponent, type PropsWithChildren } from "react";
import { MapContainer } from "../MapContainer";
import { useMap } from "@srms/components/contexts/useMapContext";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { TileWMS } from "ol/source";
import { Button } from "@srms/components/ui/Button";

// const waterMeterLayer = new TileLayer({
//   source: new TileWMS({
//     attributions: "@geoserver",
//     url: "http://172.20.110.69:8080/geoserver/gismapping3/wms?",
//     params: {
//       LAYERS: "gismapping3:WM2024_22",
//     },
//   }),
//   visible: false,
//   preload: Infinity,
//   className: "waterMeterLayer",
// });

export const Map: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [show, setShow] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);

  const map = useMap();

  useEffect(() => {
    if (!mapRef.current) return;

    map.mapManager.init({
      target: mapRef.current,
      view: new View({
        center: [13934056.114687888, 681769.5846440683],
        zoom: 16,
      }),
    });

    const pipelines = new TileLayer({
      source: new TileWMS({
        attributions: "gscwd",
        url: "http://172.20.110.69:8080/geoserver/gismapping3/wms?",
        params: {
          LAYERS: "gismapping3:Pipeline2024_28",
        },
        serverType: "geoserver",
      }),
      visible: show,
    });

    const waterMeters = new TileLayer({
      source: new TileWMS({
        attributions: "gscwd",
        url: "http://172.20.110.69:8080/geoserver/gismapping3/wms?",
        params: {
          LAYERS: "gismapping3:WM2024_22",
        },
        serverType: "geoserver",
      }),
      visible: show,
    });

    map.mapManager.getLayerManager().addLayer("pipes", pipelines);

    map.mapManager.getLayerManager().addLayer("waterMeters", waterMeters);

    return () => {
      map.mapManager.destroy();
    };
  }, [map.mapManager, show]);

  return (
    <MapContainer mapRef={mapRef}>
      <Button className="absolute top-10 right-10 z-20" onClick={() => setShow(!show)}>
        Show
      </Button>
      {children}
    </MapContainer>
  );
};
