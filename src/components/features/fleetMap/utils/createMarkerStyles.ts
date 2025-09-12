import { Circle, Fill, Stroke, Style } from "ol/style";
import { MarkerStyles } from "@srms/server/types";

export const createMarkerStyles = (styles: MarkerStyles) => {
  const markerStyle = new Style({
    image: new Circle({
      radius: styles.radius,
      fill: new Fill({
        color: styles.fillColor,
      }),
      stroke: new Stroke({
        color: styles.strokeColor,
        width: styles.strokeWidth,
      }),
    }),
  });

  return { markerStyle };
};
