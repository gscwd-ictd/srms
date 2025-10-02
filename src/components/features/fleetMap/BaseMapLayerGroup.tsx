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
        title: "OSM",
      },
    }),

    new TileLayer({
      source: new OSM({
        url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png",
      }),
      visible: true,
      preload: Infinity,
      className: BaseLayerOptions.OSMWHITE,
      properties: {
        title: "LIGHT",
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
