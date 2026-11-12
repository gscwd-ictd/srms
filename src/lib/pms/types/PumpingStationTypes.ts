import { Coordinate } from "ol/coordinate";

export type PumpingStationGEOJSON = {
  type: string;
  totalFeatures: number;
  features: Array<PumpingStationData>;
};

export type PumpingStationData = {
  type: string;
  id: string;
  geometry: PumpingStationCoordinates;
  geometry_name: string;
  properties: PumpingStationProperties;
};

export type PumpingStationCoordinates = {
  type: string;
  coordinates: Coordinate;
};

export type PumpingStationProperties = {
  ps_no: string;
  ps_name: string;
  location: string;
  motor: string;
  discharge: string;
  "rated cap": string;
  "actual cap": string;
  swl: string;
  pwl: string;
  "pump sett": string;
  "draw down": string;
  operating: string;
  wellcasing: string;
  "well depth": string;
  genset: string;
  "yr const": string;
  status: string;
  remarks: string;
};
