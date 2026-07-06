import { Stroke, Style } from "ol/style";
import { LineStringStyles } from "@srms/server/types";

export const createLineStringStyles = (styles: LineStringStyles) => {
  const lineStringStyle = new Style({
    stroke: new Stroke({
      color: styles.strokeColor,
      width: styles.strokeWidth[0],
      lineDash: styles.outlineStyle === "dashed" ? [5, 10] : undefined,
    }),
  });

  return { lineStringStyle };
};
