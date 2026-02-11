import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Style from "ol/style/Style";
import { Stroke } from "ol/style";

/**
 * Creates a Street View coverage layer.
 * extent = [minLng, minLat, maxLng, maxLat]
 */
export function createStreetViewCoverageLayer(extent: number[]) {
  console.log("Creating Street View coverage layer for extent:", extent);

  const source = new VectorSource();

  const layer = new VectorLayer({
    source,
    style: new Style({
      stroke: new Stroke({
        width: 5,
        color: "rgba(255, 251, 7, 0.97)",
      }),
    }),

    zIndex: 999,
  });

  // Fetch coverage points from API
  const [minLng, minLat, maxLng, maxLat] = extent;
  console.log(
    `/api/streetview-coverage-layer?minLat=${minLat}&maxLat=${maxLat}&minLng=${minLng}&maxLng=${maxLng}`,
  );
  fetch(`/api/streetview-coverage-layer?minLat=${minLat}&maxLat=${maxLat}&minLng=${minLng}&maxLng=${maxLng}`)
    .then((res) => res.json())
    .then((geojson) => {
      const features = new GeoJSON().readFeatures(geojson, {
        featureProjection: "EPSG:4326", // geographic coordinates
      });
      source.addFeatures(features);
      console.log("Street View features loaded:", features.length);
    })
    .catch((err) => console.error("Failed to load Street View coverage:", err));

  return layer;
}
