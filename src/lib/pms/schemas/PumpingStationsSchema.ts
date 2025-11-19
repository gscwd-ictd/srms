 import { z } from "zod";

 export const SelectPumpingStationCoordinatesSchema = z.object({
    type: z.string(),
    coordinates: z.array(z.number()).length(2),
  });

  export const SelectPumpingStationPropertiesSchema = z.object({
    ps_no: z.string(),
    ps_name: z.string(),
    location: z.string(),
    motor: z.string(),
    discharge: z.string(),
    "rated cap": z.string(),
    "actual cap": z.string(),
    swl: z.string(),
    pwl: z.string(),
    "pump sett": z.string(),
    "draw down": z.string(),
    operating: z.string(),
    wellcasing: z.string(),
    "well depth": z.string(),
    genset: z.string(),
    "yr const": z.string(),
    status: z.string(),
    remarks: z.string(),
  });

  export const SelectPumpingStationDataSchema = z.object({
    type: z.string(),
    id: z.string(),
    geometry: SelectPumpingStationCoordinatesSchema,
    geometry_name: z.string(),
    properties: SelectPumpingStationPropertiesSchema,
  });

  export const SelectPumpingStationsGeoJSONSchema = z.object({
    type: z.string(),
    totalFeatures: z.number(),
    features: z.array(SelectPumpingStationDataSchema),
  });