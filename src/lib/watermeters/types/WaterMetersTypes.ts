
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

//data received from clicking blue dot on map
export type WaterMeterFeatureData = {
  accountno: string;
  address: string;
  aveusage: string;
  billed: string;
  billedvol: string;
  bookcode: string; 
  consumern: string;
  consumert: string;
  contactno: string;
  geometry: {
    type: string;
    flatCoordinates: Coordinate;
  };
  id:string;
  datecon: string;
  datediscon: string | null;
  m3perhr: string | null;
  meterbrnd: string | null;
  meterno: string;
  metersize: string | null;
  status: string;
  zonecode: string;
};
