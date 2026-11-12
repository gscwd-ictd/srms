import { z } from "zod";

const Position = z.union([
  z.tuple([z.number(), z.number()]), // [lng, lat]
  z.tuple([z.number(), z.number(), z.number()]), // [lng, lat, alt]
]);

const LinearRing = z.array(Position).min(4); // closed ring: first point === last point
const PolygonCoords = z.array(LinearRing); // [outer ring, ...holes]

export const SelectBarangayCoordinatesSchema = z.object({
  type: z.literal("MultiPolygon"),
  coordinates: z.array(PolygonCoords),
});

export const SelectBarangayPropertiesSchema = z.object({
  barangay: z.string(),
  population: z.number(),
  serv_con: z.number(),
  pipelne_km: z.number(),
  length_mtr: z.number(),

  // Pipe length per diameter (meters)
  "50mmpipe_m": z.number(),
  "75mmpipe_m": z.number(),
  "100mmpipem": z.number(),
  "150mmpipem": z.number(),
  "200mmpipem": z.number(),
  "250mmpipem": z.number(),
  "300mmpipem": z.number(),
  "400mmpipem": z.number(),
  "500mmpipem": z.number(),

  // Complaints per year
  cmplnt2020: z.number(),
  cmplnt2021: z.number(),
  cmplnt2022: z.number(),
  cmplnt2023: z.number(),
  cmplnt2024: z.number(),

  // Service connections per year
  sercon2020: z.number(),
  sercon2021: z.number(),
  sercon2022: z.number(),
  sercon2023: z.number(),
  sercon2024: z.number(),
});

export const SelectBarangayDataSchema = z.object({
  type: z.string(),
  id: z.string(),
  geometry: SelectBarangayCoordinatesSchema,
  geometry_name: z.string(),
  properties: SelectBarangayPropertiesSchema,
});

export const SelectBarangayGeoJSONSchema = z.object({
  type: z.string(),
  totalFeatures: z.number(),
  features: z.array(SelectBarangayDataSchema),
});
