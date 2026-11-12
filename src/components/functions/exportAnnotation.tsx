import GeoJSON from "ol/format/GeoJSON";
import Circle from "ol/geom/Circle";
import Feature from "ol/Feature";
import { fromCircle } from "ol/geom/Polygon";

import { annotationSources } from "../features/annotationMap/AnnotationsLayer";

export function exportAnnotations(projection: string) {
  const geojson = new GeoJSON();

  const features: Feature[] = [];

  Object.values(annotationSources).forEach((source) => {
    source.getFeatures().forEach((feature) => {
      const clone = feature.clone();

      const geometry = clone.getGeometry();

      if (geometry instanceof Circle) {
        clone.setGeometry(fromCircle(geometry, 64));
      }

      features.push(clone);
    });
  });

  // ... write GeoJSON and download ...
  const json = geojson.writeFeatures(features, {
    featureProjection: projection,
    dataProjection: "EPSG:4326",
    decimals: 8,
  });

  const blob = new Blob([json], {
    type: "application/geo+json",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "annotations.geojson";
  a.click();

  URL.revokeObjectURL(url);
}
