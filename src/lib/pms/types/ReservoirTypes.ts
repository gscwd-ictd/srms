import { Coordinate } from "ol/coordinate";
import { LineString } from "ol/geom";

export type ReservoirGeoJSON = {
  type: string;
  totalFeatures: number;
  features: Array<ReservoirData>;
};

export type ReservoirData = {
  type: string;
  id: string;
  geometry: ReservoirCoordinates;
  geometry_name: string;
  properties: ReservoirProperties;
};

export type ReservoirCoordinates = {
  type: string;
  coordinates: number[] | (Coordinate[] | LineString)[];
};

export type ReservoirProperties = {
  source: string;
  location: string;
  cap_gal: number;
  "cap_cu.m": number;
  chamber: string;
  type_res: string;
  material: string;
  status: string;
  system: string;
};
