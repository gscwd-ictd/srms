import { createAnnotationStyle } from "@srms/components/functions/annotationStyle";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

export const polygonSource = new VectorSource();
export const lineSource = new VectorSource();
export const pointSource = new VectorSource();
export const circleSource = new VectorSource();

export const polygonLayer = new VectorLayer({
  source: polygonSource,
  style: (feature) => {
    return createAnnotationStyle(
      feature.getGeometry()?.getType() ?? "",
      feature.get("borderColor") ?? "#2563eb",
      feature.get("fillColor") ?? "#0f368a",
    );
  },
});

export const lineLayer = new VectorLayer({
  source: lineSource,
  style: (feature) => {
    return createAnnotationStyle(
      feature.getGeometry()?.getType(),
      feature.get("borderColor") ?? "#eb3225",
      feature.get("fillColor") ?? "#8a210f",
    );
  },
});

export const pointLayer = new VectorLayer({
  source: pointSource,
  style: (feature) => {
    return createAnnotationStyle(
      feature.getGeometry()?.getType(),
      feature.get("borderColor") ?? "#25eb25",
      feature.get("fillColor") ?? "#25eb56",
    );
  },
});

export const circleLayer = new VectorLayer({
  source: circleSource,
  style: (feature) => {
    return createAnnotationStyle(
      feature.getGeometry()?.getType(),
      feature.get("borderColor") ?? "#25eb25",
      feature.get("fillColor") ?? "#25eb56",
    );
  },
});

export const annotationLayers = {
  Polygon: polygonLayer,
  LineString: lineLayer,
  Point: pointLayer,
  Circle: circleLayer,
};

export const annotationSources = {
  Polygon: polygonSource,
  LineString: lineSource,
  Point: pointSource,
  Circle: circleSource,
};
