"use client";

import { FunctionComponent, useEffect } from "react";
import { useServiceableAreaMap } from "./contexts/useServiceableMapContext";
import Modify from "ol/interaction/Modify";
import MultiPolygon from "ol/geom/MultiPolygon";
import Polygon from "ol/geom/Polygon";
// @ts-expect-error ServiceableAreaGeoJSON has already been removed
import { ServiceableAreaGeoJSON } from "@srms/server/types";

export const ServiceableAreaModifyFeatures: FunctionComponent = () => {
  const serviceableArea = useServiceableAreaMap();

  useEffect(() => {
    serviceableArea.mapManager.getInteractionManager().enableModify("serviceableAreas");

    const modifyInteraction = serviceableArea.mapManager
      .getInteractionManager()
      .getInteractionById("modify") as Modify;

    modifyInteraction.on("modifyend", (event) => {
      const features = event.features.getArray();

      features.forEach((feature) => {
        const geometry = feature.getGeometry();

        if (!geometry) return;

        let coordinates;

        // Check geometry type and handle accordingly
        if (geometry instanceof MultiPolygon) {
          coordinates = geometry.getCoordinates();
        }

        // Check if geometry is a Polygon
        else if (geometry instanceof Polygon) {
          coordinates = [geometry.getCoordinates()]; // Wrap in array to match MultiPolygon format
        }

        // Log a warning
        else {
          console.warn("Unsupported geometry type");
          return;
        }

        // Get any other properties you need
        const properties = feature.getProperties() as ServiceableAreaGeoJSON;

        // Save to database
        console.log({ coordinates, properties, shape: properties.id });
      });
    });
  }, [serviceableArea.mapManager]);

  return <></>;
};
