"use client";

// import { useGeo } from "@srms/components/hooks/useGeo";
import { useEffect, type FunctionComponent } from "react";
import { useServiceableAreaMap } from "./contexts/useServiceableMapContext";
import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { createFeatureStyles } from "./utils/createFeatureStyles";
import { FeatureStyles } from "@srms/server/types";
import { MultiPolygon } from "ol/geom";
import Select from "ol/interaction/Select";
import { click } from "ol/events/condition";

const featureManager = new FeatureManager();

export const ServiceableAreaFeatures: FunctionComponent = () => {
  const serviceableAreaMap = useServiceableAreaMap();

  useEffect(() => {
    if (!serviceableAreaMap.mapManager) return;

    const vectorSource = new VectorSource();

    const vectorLayer = new VectorLayer();

    serviceableAreaMap.serviceableAreas.forEach((area) => {
      const feature = featureManager.createFeature(new MultiPolygon(area.boundaries.coordinates), {
        id: area.id,
        name: area.barangay,
        description: area.barangay,
        featureStyles: area.featureStyles,
      });

      vectorSource.addFeature(feature);

      const featureStyle = createFeatureStyles(area.featureStyles as FeatureStyles);

      feature.setStyle(featureStyle.drawStyle);
    });

    vectorLayer.setSource(vectorSource);

    serviceableAreaMap.mapManager.getLayerManager().addLayer("serviceableAreas", vectorLayer);

    const select = new Select({
      condition: click, // hovering event on a feature - use `click` if you want click event
      layers: [vectorLayer], // only select from this layer
    });

    serviceableAreaMap.mapManager.getMap().addInteraction(select);

    select.on("select", (event) => {
      const selectedFeatures = event.selected;

      if (selectedFeatures.length > 0) {
        // Get the first selected feature
        const feature = selectedFeatures[0];

        // Get the properties
        const properties = feature?.getProperties();

        console.log(properties);
      }
    });

    return () => {
      serviceableAreaMap.mapManager.getLayerManager().removeLayer("serviceableAreas");
    };
  }, [serviceableAreaMap.mapManager, serviceableAreaMap.serviceableAreas]);

  return null;
};
