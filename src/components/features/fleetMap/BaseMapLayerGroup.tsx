import { BaseLayerOptions } from "@srms/components/enums";
import LayerGroup from "ol/layer/Group";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
// import BingMaps from "ol/source/BingMaps.js";

export const BaseMapLayerGroup: LayerGroup = new LayerGroup({
  layers: [
    // Set to true to set as default base map layer
    new TileLayer({
      source: new OSM(),
      visible: true,
      preload: Infinity,
      className: BaseLayerOptions.OSM,
      properties: {
        title: "OpenStreetMap",
      },
    }),

    new TileLayer({
      source: new OSM({
        url: `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`,
      }),
      visible: false,
      preload: Infinity,
      className: BaseLayerOptions.OSM_BRIGHT,
      properties: {
        title: "OsmBright",
      },
    }),

    // new TileLayer({
    //   source: new BingMaps({
    //     key: `${process.env.NEXT_PUBLIC_BING_KEY}`,
    //     imagerySet: `AerialWithLabelsOnDemand`,
    //   }),
    //   visible: false,
    //   preload: Infinity,
    //   className: BaseLayerOptions.BING_AERIAL,
    //   properties: {
    //     title: "Bing Aerial",
    //   },
    // }),
  ],
});
