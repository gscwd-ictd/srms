import TileLayer from "ol/layer/Tile";
import TileSource from "ol/source/Tile";
import { BaseLayerOptions } from "../enums";

export type ViewPort = {
  projection: string;
  center: [number, number];
  zoom: number;
  maxZoom?: number;
  minZoom?: number;
  extent?: [number, number, number, number];
};

export type TileLayerType = {
  attributions: string;
  url: string;
  layers: string;
  visible: boolean;
  preload: number;
  className: string;
};

export type LayerVisibility = Pick<TileLayerType, "className" | "visible">;

export type MapVectorLayers = {
  layersVisibility: Array<LayerVisibility>;
};

export type BaseMapConfig = {
  title: BaseLayerOptions;
  layer: TileLayer<TileSource>;
};
