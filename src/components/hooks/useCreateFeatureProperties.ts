"use client";

import { FeatureProperties } from "@srms/lib/mapstudio/featureManager";
import { Fill, Stroke, Style } from "ol/style";

export const useCreateFeatureProperties = (properties: FeatureProperties | undefined) => {
  if (!properties) return;

  const style = new Style({
    fill: new Fill({
      color: properties.fillColor,
    }),
    stroke: new Stroke({
      color: properties.strokeColor,
      width: properties.strokeWidth[0],
      lineDash: properties.outlineStyle === "dashed" ? [5, 10] : undefined,
    }),
  });

  return { style };
};
