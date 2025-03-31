import { z } from "zod";
import { ServiceableAreaSchema } from "../schemas";

export type ServiceableArea = z.infer<typeof ServiceableAreaSchema>;
