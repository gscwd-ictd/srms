import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style } from "ol/style";

export const polygonSource = new VectorSource();
export const lineSource = new VectorSource();
export const pointSource = new VectorSource();
export const circleSource = new VectorSource();

export const polygonLayer = new VectorLayer({
  source: polygonSource,
  style: new Style({
    stroke: new Stroke({
      color: "#2563eb",
      width: 2,
    }),
    fill: new Fill({
      color: "rgba(37, 99, 235, 0.2)",
    }),
  }),
});

export const lineLayer = new VectorLayer({
  source: lineSource,
  style: new Style({
    stroke: new Stroke({
      color: "#eb5d25",
      width: 2,
    }),
    fill: new Fill({
      color: "rgba(221, 62, 13, 0.2)",
    }),
  }),
});

export const pointLayer = new VectorLayer({
  source: pointSource,
  style: new Style({
    stroke: new Stroke({
      color: "#25eb25",
      width: 2,
    }),
    fill: new Fill({
      color: "rgba(37, 235, 86, 0.2)",
    }),
  }),
});

export const circleLayer = new VectorLayer({
  source: circleSource,
  style: new Style({
    stroke: new Stroke({
      color: "#eb3c25",
      width: 2,
    }),
    fill: new Fill({
      color: "rgba(235, 44, 37, 0.2)",
    }),
  }),
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
