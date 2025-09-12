import { Coordinate } from "ol/coordinate";

export type WaterMeterCoordinates = {
  type: string;
  coordinates: Coordinate;
  // number[] | Coordinate | (Coordinate[] | LineString)[];
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
  consumert: string | null;
  meterbrnd: string | null;
  metersize: string | null;
  aveusage: string | null;
  m3perhr: string | null;
  contactno: string | null;
  billedvol: string | null;
  billed: string | null;
};

export type WaterMeterData = {
  type: string;
  id: string;
  geometry: WaterMeterCoordinates;
  geometry_name: string;
  properties: WaterMeterProperties;
};

export type ConsumersWaterMeterDetails = Array<WaterMeterData>;

export type WaterMetersGeoJSON = {
  type: string;
  totalFeatures: number;
  features: ConsumersWaterMeterDetails;
};

export type WaterMeterFilter = {
  id: string;
  value: string;
};
