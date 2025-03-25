import { z } from "zod";
import { createFixtureUnitsSchema, selectFixtureUnitsSchema, updateFixtureUnitsSchema } from "../schemas";

export type FixtureUnit = z.infer<typeof selectFixtureUnitsSchema>;
export type CreateFixtureUnit = z.infer<typeof createFixtureUnitsSchema>;
export type UpdateFixtureUnit = z.infer<typeof updateFixtureUnitsSchema>;
