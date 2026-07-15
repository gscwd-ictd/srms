import { Fill, Icon, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import Pin from "../../../public/images/pin.svg";

export function createAnnotationStyle(
  geometryType: string | undefined,
  borderColor: string,
  fillColor: string,
) {
  if (geometryType === "Point") {
    return [
      new Style({
        image: new CircleStyle({
          radius: 15,
          fill: new Fill({
            color: fillColor,
          }),
          stroke: new Stroke({
            color: borderColor,
            width: 2,
          }),
        }),
      }),
      new Style({
        image: new Icon({
          src: Pin.src!,
          scale: 0.8,
          anchor: [0.5, 0.5],
          anchorXUnits: "fraction",
          anchorYUnits: "fraction",
        }),
      }),
    ];
  }

  return new Style({
    stroke: new Stroke({
      color: borderColor,
      width: 2,
    }),
    fill: new Fill({
      color: `${fillColor}33`, // add transparency to fill color
    }),
  });
}
