"use client";

// import { useGeo } from "@srms/components/hooks/useGeo";
import { useEffect, type FunctionComponent } from "react";
import { useServiceableAreaMap } from "./contexts/useServiceableMapContext";
import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
import { Fill, Stroke, Style } from "ol/style";
import VectorSource from "ol/source/Vector";
import Polygon from "ol/geom/Polygon";
import VectorLayer from "ol/layer/Vector";

const featureManager = new FeatureManager();

export const ServiceableAreaFeatures: FunctionComponent = () => {
  const serviceableAreaMap = useServiceableAreaMap();

  useEffect(() => {
    if (!serviceableAreaMap.mapManager) return;

    const vectorSource = new VectorSource();

    serviceableAreaMap.serviceableAreas.forEach((area) => {
      const feature = featureManager.createFeature(new Polygon(area.boundaries.coordinates), {
        id: area.id,
        name: area.barangay,
        description: area.barangay,
      });

      vectorSource.addFeature(feature);
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({
          color: "blue",
          width: 2,
          lineJoin: "round",
          lineCap: "round",
          lineDash: [5, 10],
          lineDashOffset: 40,
        }),
        fill: new Fill({
          color: "rgba(0, 0, 255, 0.1)",
        }),
      }),
    });

    serviceableAreaMap.mapManager.getLayerManager().addLayer("serviceableAreas", vectorLayer);

    serviceableAreaMap.mapManager.addMapEvent("click", (e) => console.log(e.coordinate, "from features"));

    return () => {
      serviceableAreaMap.mapManager.getLayerManager().removeLayer("serviceableAreas");
    };
  }, [serviceableAreaMap.mapManager, serviceableAreaMap.serviceableAreas]);

  return null;
};
