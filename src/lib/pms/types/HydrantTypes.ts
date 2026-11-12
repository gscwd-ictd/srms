import { Coordinate } from "ol/coordinate";
import { LineString } from "ol/geom";

export type HydrantGeoJSON = {
  type: string;
  totalFeatures: number;
  features: Array<HydrantData>;
};

export type HydrantData = {
  type: string;
  id: string;
  geometry: HydrantCoordinates;
  geometry_name: string;
  properties: HydrantProperties;
};

export type HydrantCoordinates = {
  type: string;
  coordinates: number[] | (Coordinate[] | LineString)[];
};

export type HydrantProperties = {
  location: string;
  barangay: string;
  landmark: string | null;
  status: string;
};
