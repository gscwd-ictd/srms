import {
  CreatePlumbingFixtureSchema,
  SelectPlumbingFixtureSchema,
  UpdatePlumbingFixtureSchema,
} from "../schemas";
import { z } from "@hono/zod-openapi";

export type PlumbingFixture = z.infer<typeof SelectPlumbingFixtureSchema>;
export type CreatePlumbingFixture = z.infer<typeof CreatePlumbingFixtureSchema>;
export type UpdatePlumbingFixture = z.infer<typeof UpdatePlumbingFixtureSchema>;
