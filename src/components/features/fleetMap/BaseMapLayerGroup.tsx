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
  ],
});
