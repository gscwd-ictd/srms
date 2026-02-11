/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { type PropsWithChildren, type FunctionComponent, useRef, useEffect, useState } from "react";
import { useGeographic } from "ol/proj";
import View from "ol/View";
import { BaseMapLayerGroup } from "./BaseMapLayerGroup";
import { useAdminMonitMap } from "./contexts/useAdminMonitMapContext";
import { useMapStore } from "@srms/components/stores/useMapStore";
import { usePositionStore } from "@srms/components/stores/usePositionStore";
// import { createStreetViewCoverageLayer } from "../streetView/StreetViewCoverageLayer";
// import Point from "ol/geom/Point";

export const AdminMonitMap: FunctionComponent<PropsWithChildren> = ({ children }) => {
  useGeographic(); // make map use geographic coordinates

  const adminMonitMap = useAdminMonitMap();
  const mapRef = useRef<HTMLDivElement>(null);

  const { viewport } = useMapStore();
  const setLat = usePositionStore((state) => state.setLat);
  const setLng = usePositionStore((state) => state.setLng);

  const [profile, setProfile] = useState<any>(null);
  useEffect(() => {
    async function getProfile() {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setProfile(data);
    }

    getProfile();
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    adminMonitMap.mapManager.init({
      layers: [BaseMapLayerGroup],
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

    const map = adminMonitMap.mapManager.getMap();

    // const coverageExtent = [125.17028, 6.116382, 125.17597, 6.1186]; //street view coverage extent around oval plaza
    // const coverageLayer = createStreetViewCoverageLayer(coverageExtent);

    // ADD THE LAYER
    // map.addLayer(coverageLayer);

    // Optional
    // map.getView().fit(coverageExtent, {
    //   padding: [20, 20, 20, 20],
    //   duration: 500,
    // });

    // Click handler
    map.on("click", (e) => {
      const [lng, lat] = e.coordinate;
      setLng(lng!);
      setLat(lat!);
      console.log(`Map clicked at lng: ${lng}, lat: ${lat}`);
    });

    // add feature HANDLER
    // coverageLayer.getSource()?.on("addfeature", (e) => {
    //   const geom = e.feature!.getGeometry();

    //   if (geom instanceof Point) {
    //     console.log("Feature added:", geom.getCoordinates());
    //   }
    // });

    return () => {
      adminMonitMap.mapManager.destroy();
      mapRef.current = null;
    };
  }, [adminMonitMap.mapManager]);

  return (
    <div ref={mapRef} className="relative z-20 h-full w-full">
      {children}
    </div>
  );
};
