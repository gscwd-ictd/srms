import {
  CreatePlumbingFixtureSchema,
  SelectPlumbingFixtureSchema,
  UpdatePlumbingFixtureSchema,
} from "@srms/server/db/schemas";
import { z } from "zod";

export type PlumbingFixture = z.infer<typeof SelectPlumbingFixtureSchema>;
export type CreatePlumbingFixture = z.infer<typeof CreatePlumbingFixtureSchema>;
export type UpdatePlumbingFixture = z.infer<typeof UpdatePlumbingFixtureSchema>;
