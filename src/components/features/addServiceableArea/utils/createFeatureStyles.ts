import { FeatureStyles } from "../ServiceableAreaMap";
import { Circle, Fill, Stroke, Style } from "ol/style";
import { type SnapConfig } from "@srms/lib/mapstudio/interactionManager";

export const createFeatureStyles = (styles: FeatureStyles) => {
  const drawStyle = new Style({
    fill: new Fill({
      color: styles.fillColor,
    }),
    stroke: new Stroke({
      color: styles.strokeColor,
      width: styles.strokeWidth[0],
      lineDash: styles.outlineStyle === "dashed" ? [5, 10] : undefined,
    }),
    image: new Circle({
      radius: Number(styles.strokeWidth[0]) < 5 ? 5 : Number(styles.strokeWidth[0] as number),
      fill: new Fill({
        color: styles.strokeColor,
      }),
      stroke: new Stroke({
        color: styles.fillColor,
        width: 1,
      }),
    }),
  });

  const snapConfig: Omit<SnapConfig, "source"> = {
    pixel: styles.snapTolerance[0],
    edge: styles.snapToEdge,
    vertex: styles.snapToVertex,
  };

  return { drawStyle, snapping: styles.enableSnapping ? snapConfig : false, freehand: styles.freehand };
};
