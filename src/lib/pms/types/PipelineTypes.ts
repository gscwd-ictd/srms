// import { Coordinate } from "ol/coordinate";
import { Coordinate } from "ol/coordinate";
import { LineString } from "ol/geom";

export type PipelineCoordinates = {
  type: string;
  coordinates: number[] | (Coordinate[] | LineString)[];
};

export type PipelineProperties = {
  diameter: string;
  material: string;
};

export type PipelineData = {
  type: string;
  id: string;
  geometry: PipelineCoordinates;
  geometry_name: string;
  properties: PipelineProperties;
};

export type PipelinesGeoJSON = {
  type: string;
  totalFeatures: number;
  features: Array<PipelineData>;
};
