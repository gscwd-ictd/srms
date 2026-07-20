/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { type PropsWithChildren, type FunctionComponent, useRef, useEffect, useState } from "react";
import { useGeographic } from "ol/proj";
import View from "ol/View";
import { BaseMapLayerGroup } from "./BaseMapLayerGroup";
import { useGisMap } from "./contexts/useGisMapContext";
import { useMapStore } from "@srms/components/stores/useMapStore";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { useGooglePlacesPOI } from "@srms/components/hooks/useGooglePlacesPoi";
import Map from "ol/Map";

export const poiSource = new VectorSource();

export const poiLayer = new VectorLayer({
  source: poiSource,
  zIndex: 995,
});

export const GisMap: FunctionComponent<PropsWithChildren> = ({ children }) => {
  // const { setOpen } = useSidebar();

  /**
   * Calling the useGeographic function makes it so the map view uses
   * geographic coordinates (even if the view projection is not geographic).
   *
   * See more at: https://openlayers.org/en/latest/apidoc/module-ol_proj.html#.useGeographic
   */
  useGeographic();

  const gisMap = useGisMap();

  const { viewport } = useMapStore();

  const mapRef = useRef<HTMLDivElement>(null);

  const { poiVisible } = useMapStore();

  const [map, setMap] = useState<Map>({} as Map);

  useGooglePlacesPOI(map ?? null, poiSource, poiVisible);

  useEffect(() => {
    // // By default in this page, sidebar is closed
    // setOpen(false);

    if (!mapRef.current) return;

    gisMap.mapManager.init({
      layers: [BaseMapLayerGroup, poiLayer],
      target: mapRef.current,
      view: new View({
        projection: viewport.projection,
        center: viewport.center,
        zoom: viewport.zoom,
        extent: viewport.extent,
        maxZoom: viewport.maxZoom,
        minZoom: viewport.minZoom,
      }),
    });

    const map = gisMap.mapManager.getMap();

    if (!map) return;

    setMap(map);

    return () => {
      gisMap.mapManager.destroy();
      mapRef.current = null;
    };
  }, [gisMap.mapManager]);

  useEffect(() => {
    poiLayer.setVisible(poiVisible);

    if (!poiVisible) {
      poiSource.clear();
    }
  }, [poiVisible]);

  return (
    <div ref={mapRef} className="h-full w-full">
      {children}
    </div>
  );
};
