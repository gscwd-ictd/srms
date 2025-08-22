import { z } from "zod";

export const SelectWaterMeterCoordinatesSchema = z.object({
  type: z.string(),
  coordinates: z.array(z.number()).length(2),
});

export const SelectWaterMeterPropertiesSchema = z.object({
  accountno: z.string(),
  meterno: z.string(),
  consumern: z.string(),
  address: z.string(),
  datecon: z.string(),
  status: z.string(),
  datediscon: z.string().nullable(),
  zonecode: z.string(),
  bookcode: z.string(),
  consumert: z.string(),
  meterbrnd: z.string(),
  metersize: z.string(),
  aveusage: z.string(),
  m3perhr: z.string(),
  contactno: z.string(),
  billedvol: z.string(),
  billed: z.string(),
});

export const SelectWaterMeterDataSchema = z.object({
  type: z.string(),
  id: z.string(),
  geometry: SelectWaterMeterCoordinatesSchema,
  geometry_name: z.string(),
  properties: SelectWaterMeterPropertiesSchema,
});

export const SelectWaterMetersGeoJSONSchema = z.object({
  type: z.string(),
  totalFeatures: z.number(),
  features: z.array(SelectWaterMeterDataSchema),
});
