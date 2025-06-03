"use client";

import { useEffect, type FunctionComponent } from "react";
import { useServiceableAreaMap } from "./contexts/useServiceableMapContext";
import { click } from "ol/events/condition";
import { Select } from "ol/interaction";

export const ServiceableAreaSelectFeatures: FunctionComponent = () => {
  const serviceableAreaMap = useServiceableAreaMap();

  useEffect(() => {
    const select = new Select({
      condition: click, // hovering event on a feature - use `click` if you want click event
      //layers: [vectorLayer], // only select from this layer
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
  }, [serviceableAreaMap.mapManager]);

  return <></>;
};
