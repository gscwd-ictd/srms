import { Fill, Icon, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import Pin from "../../../public/images/svg-icons/pin.svg";
import { annotationIconMap } from "@srms/utils/annotationIcons";

function transparentFill(color: string) {
  if (color.startsWith("rgba")) {
    return color;
  }

  if (color.startsWith("#") && color.length === 7) {
    return `${color}33`;
  }

  return color;
}

export function createAnnotationStyle(
  geometryType: string | undefined,
  borderColor: string,
  fillColor: string,
  iconName: string = "default",
) {
  if (geometryType === "Point") {
    const iconSrc = annotationIconMap[iconName] ?? Pin.src;

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
          src: iconSrc,
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
      color: transparentFill(fillColor),
    }),
  });
}
