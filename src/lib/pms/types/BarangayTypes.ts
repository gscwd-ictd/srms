type Position = [number, number] | [number, number, number]; // [lng, lat, alt?]
type LinearRing = Position[];
type PolygonCoords = LinearRing[];

export type BarangayCoordinates = {
  type: string;
  coordinates: number[][][][] | PolygonCoords[];
};

export type BarangayProperties = {
  barangay: string;
  population: number;
  serv_con: number;
  pipelne_km: number;
  length_mtr: number;
  "50mmpipe_m": number;
  "75mmpipe_m": number;
  "100mmpipem": number;
  "150mmpipem": number;
  "200mmpipem": number;
  "250mmpipem": number;
  "300mmpipem": number;
  "400mmpipem": number;
  "500mmpipem": number;
  cmplnt2020: number;
  cmplnt2021: number;
  cmplnt2022: number;
  cmplnt2023: number;
  cmplnt2024: number;
  sercon2020: number;
  sercon2021: number;
  sercon2022: number;
  sercon2023: number;
  sercon2024: number;
};

export type BarangayData = {
  type: string;
  id: string;
  geometry: BarangayCoordinates;
  geometry_name: string;
  properties: BarangayProperties;
};

export type BarangayGeoJSON = {
  type: string;
  totalFeatures: number;
  features: Array<BarangayData>;
};
