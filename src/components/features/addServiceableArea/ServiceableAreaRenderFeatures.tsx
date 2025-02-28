"use client";

// import { useGeo } from "@srms/components/hooks/useGeo";
import { useEffect, type FunctionComponent } from "react";
import { useServiceableAreaMap } from "./contexts/useServiceableMapContext";
import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
import { createFeatureStyles } from "./utils/createFeatureStyles";
import { FeatureStyles } from "@srms/server/types/helperTypes";
import { MultiPolygon } from "ol/geom";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";

const featureManager = new FeatureManager();

export const ServiceableAreaRenderFeatures: FunctionComponent = () => {
  const serviceableAreaMap = useServiceableAreaMap();

  useEffect(() => {
    if (!serviceableAreaMap.mapManager) return;

    const vectorSource = new VectorSource();

    const vectorLayer = new VectorLayer();

    serviceableAreaMap.mapManager.getMap().on("click", (e) => {
      const polygonCoordinates = serviceableAreaMap.serviceableAreas.flatMap(
        (area) => area.boundaries.coordinates,
      );

      const multipolygon = new MultiPolygon(polygonCoordinates);

      const isInside = multipolygon.containsXY(e.coordinate[0]!, e.coordinate[1]!);

      console.log({ isInside });
    });

    serviceableAreaMap.serviceableAreas.forEach((area) => {
      const feature = featureManager.createFeature(new MultiPolygon(area.boundaries.coordinates), area);

      vectorSource.addFeature(feature);

      const featureStyle = createFeatureStyles(area.featureStyles as FeatureStyles);

      feature.setStyle(featureStyle.drawStyle);
    });

    vectorLayer.setSource(vectorSource);

    vectorLayer.setProperties({ id: "serviceableAreas" });

    serviceableAreaMap.mapManager.getLayerManager().addLayer("serviceableAreas", vectorLayer);

    return () => {
      serviceableAreaMap.mapManager.getLayerManager().removeLayer("serviceableAreas");
    };
  }, [serviceableAreaMap.mapManager, serviceableAreaMap.serviceableAreas]);

  return null;
};
