import { Fill, Stroke, Style, Text } from "ol/style";
import { LabelStyles } from "@srms/server/types";

export const createLabelStyles = (styles: LabelStyles) => {
  const labelStyle = new Style({
    text: new Text({
      font: styles.font,
      overflow: styles.overflow,
      fill: new Fill({
        color: styles.fillColor,
      }),
      stroke: new Stroke({
        color: styles.strokeColor,
        width: styles.width,
      }),
      offsetY: styles.offsetY,
      text: styles.text,
    }),
  });

  return { labelStyle };
};
