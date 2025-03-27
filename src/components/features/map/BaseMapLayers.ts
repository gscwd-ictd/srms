import { BaseLayerOptions } from "@srms/components/enums";
import { BaseMapConfig } from "@srms/components/types";
import LayerGroup from "ol/layer/Group";
import TileLayer from "ol/layer/Tile";
import { Google, OSM } from "ol/source";
import BingMaps from "ol/source/BingMaps.js";

export const BaseMapLayers: BaseMapConfig[] = [
  // Set to true to set as default base map layer
  {
    title: BaseLayerOptions.OSM,
    layer: new TileLayer({
      source: new OSM(),
      visible: true,
      preload: Infinity,
      className: BaseLayerOptions.OSM,
    }),
  },

  {
    title: BaseLayerOptions.GOOGLE_MAP,
    layer: new TileLayer({
      source: new Google({
        key: ` AIzaSyBmwXqqGZ_BTMB73dyCsCgL315lUqy87hY`,
      }),
      visible: false,
      preload: Infinity,
      className: BaseLayerOptions.GOOGLE_MAP,
    }),
  },

  {
    title: BaseLayerOptions.BING_AERIAL,
    layer: new TileLayer({
      source: new BingMaps({
        key: `${process.env.NEXT_PUBLIC_BING_KEY}`,
        imagerySet: `AerialWithLabelsOnDemand`,
      }),
      visible: false,
      preload: Infinity,
      className: BaseLayerOptions.BING_AERIAL,
    }),
  },
];

// get the layers from the layerList
// to be used in the layer group
const layers = BaseMapLayers.map((layer) => layer.layer);

// create the layer group
export const mapStyles = new LayerGroup({
  layers,
});
