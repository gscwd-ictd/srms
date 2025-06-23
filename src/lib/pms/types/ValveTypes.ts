import { Point } from "ol/geom";
import { Coordinate } from "ol/coordinate";

export type ValveCoordinates = {
  type: string;
  coordinates: Coordinate;
};

export type ValveProperties = {
  diameter: string;
  brand: string;
  "yr.install": string;
  status: string;
  curnt_stat: string;
  type: string;
};

export type ValveData = {
  type: string;
  id: string;
  geometry: ValveCoordinates;
  geometry_name: string;
  properties: ValveProperties;
};

export type ValvesGeoJSON = {
  type: string;
  totalFeatures: number;
  features: Array<ValveData>;
};

export type MapValveData = { geometry: Point } & Omit<
  ValveData,
  "type" | "geometry" | "geometry_name" | "properties"
> &
  ValveProperties;
