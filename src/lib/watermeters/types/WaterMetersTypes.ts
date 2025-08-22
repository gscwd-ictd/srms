import { Coordinate } from "ol/coordinate";
import { LineString } from "ol/geom";

export type WaterMeterCoordinates = {
  type: string;
  coordinates: number[] | (Coordinate[] | LineString)[];
};

export type WaterMeterProperties = {
  accountno: string;
  meterno: string;
  consumern: string;
  address: string;
  datecon: string;
  status: string;
  datediscon: string | null;
  zonecode: string;
  bookcode: string;
  consumert: string;
  meterbrnd: string;
  metersize: string;
  aveusage: string;
  m3perhr: string;
  contactno: string;
  billedvol: string;
  billed: string;
};

export type WaterMeterData = {
  type: string;
  id: string;
  geometry: WaterMeterCoordinates;
  geometry_name: string;
  properties: WaterMeterProperties;
};

export type WaterMetersGeoJSON = {
  type: string;
  totalFeatures: number;
  features: Array<WaterMeterData>;
};
