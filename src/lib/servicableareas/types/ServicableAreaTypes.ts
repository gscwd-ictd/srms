import { z } from "zod";
import {
  CreateServiceableAreaSchema,
  SelectServiceableAreaGeoJSONSchema,
  SelectServiceableAreaSchema,
} from "../schemas/ServiceableAreaSchema";

export type ServiceableArea = z.infer<typeof SelectServiceableAreaSchema>;
export type ServiceableAreaGeoJSON = z.infer<typeof SelectServiceableAreaGeoJSONSchema>;
export type CreateServiceableArea = z.infer<typeof CreateServiceableAreaSchema>;
