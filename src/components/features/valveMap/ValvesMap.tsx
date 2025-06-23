"use client";

import { type PropsWithChildren, type FunctionComponent, useRef, useEffect } from "react";
import { useGeographic } from "ol/proj";
import View from "ol/View";
import { useValvesMap } from "./contexts/useValvesMapContext";
import { BaseMapLayerGroup } from "./BaseMapLayerGroup";

export const ValvesMap: FunctionComponent<PropsWithChildren> = ({ children }) => {
  /**
   * Calling the useGeographic function makes it so the map view uses
   * geographic coordinates (even if the view projection is not geographic).
   *
   * See more at: https://openlayers.org/en/latest/apidoc/module-ol_proj.html#.useGeographic
   */
  useGeographic();

  const valvesMap = useValvesMap();

  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    valvesMap.mapManager.init({
      layers: [BaseMapLayerGroup],
      target: mapRef.current,
      view: new View({
        projection: "EPSG:4326",
        center: [125.17189194375173, 6.113035811082611],
        zoom: 16,
        maxZoom: 25,
        minZoom: 12,
        showFullExtent: true,
      }),
    });

    // Console coordinates
    // valvesMap.mapManager.getMap().on("click", (e) => console.log(e.coordinate));

    // Testing Extent functionality
    // valvesMap.mapManager
    //   .getMap()
    //   .getLayers()
    //   .getArray()[0]
    //   ?.setExtent([5.9612280279350145, 125.28567920348077, 6.3129954587321295, 125.32948570886408]);
    // [5.953291, 125.278558, 6.325989, 125.286705],
    // [13906485.166068409, 662066.9967097231, 13948865.159361392, 706731.4638312651]
    // [5.9612280279350145, 125.28567920348077, 6.3129954587321295, 125.32948570886408]

    return () => {
      valvesMap.mapManager.destroy();
      mapRef.current = null;
    };
  }, [valvesMap.mapManager]);

  return (
    <div ref={mapRef} className="relative z-20 h-full w-full">
      {children}
    </div>
  );
};
