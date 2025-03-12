import { createFixtureUnitsSchema, selectFixtureUnitsSchema } from "@srms/server/db/schemas";
import { z } from "zod";

export type FixtureUnit = z.infer<typeof selectFixtureUnitsSchema>;
export type CreateFixtureUnit = z.infer<typeof createFixtureUnitsSchema>;
