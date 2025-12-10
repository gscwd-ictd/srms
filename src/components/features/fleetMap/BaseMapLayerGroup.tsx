import { BaseLayerOptions } from "@srms/components/enums";
import LayerGroup from "ol/layer/Group";
import TileLayer from "ol/layer/Tile";
import { Google, OSM } from "ol/source";
// import BingMaps from "ol/source/BingMaps.js";

export const BaseMapLayerGroup: LayerGroup = new LayerGroup({
  layers: [
    // Set to true to set as default base map layer
    // new TileLayer({
    //   source: new OSM(),
    //   visible: true,
    //   preload: Infinity,
    //   className: BaseLayerOptions.OSM,
    //   properties: {
    //     title: "OpenStreetMap",
    //   },
    // }),
    new TileLayer({
      source: new OSM({
        url: `https://maps.geoapify.com/v1/tile/positron/{z}/{x}/{y}.png?apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`,
      }),
      visible: true,
      preload: Infinity,
      className: BaseLayerOptions.POSITRON,
      properties: {
        title: "Positron",
      },
    }),

    new TileLayer({
      source: new Google({
        key: "AIzaSyBZV9OFOavXzB-kM8ASQX4ZjFBXN9TFEwI",
        scale: "scaleFactor2x",
        highDpi: true,
        mapType: "roadmap",
      }),
      visible: false,
      preload: Infinity,
      className: BaseLayerOptions.GOOGLE_MAP_ROAD,
      properties: {
        title: "GM Road",
      },
    }),

    new TileLayer({
      source: new Google({
        key: "AIzaSyBZV9OFOavXzB-kM8ASQX4ZjFBXN9TFEwI",
        scale: "scaleFactor2x",
        highDpi: true,
        mapType: "satellite",
      }),
      visible: false,
      preload: Infinity,
      className: BaseLayerOptions.GOOGLE_MAP_SATELLITE,
      properties: {
        title: "GM Satellite",
      },
    }),

    new TileLayer({
      source: new Google({
        key: "AIzaSyBZV9OFOavXzB-kM8ASQX4ZjFBXN9TFEwI",
        scale: "scaleFactor2x",
        highDpi: true,
        mapType: "terrain",
        layerTypes: ["layerRoadMap"],
      }),
      visible: false,
      preload: Infinity,
      className: BaseLayerOptions.GOOGLE_MAP_TERRAIN,
      properties: {
        title: "GM Terrain",
      },
    }),
  ],
});
