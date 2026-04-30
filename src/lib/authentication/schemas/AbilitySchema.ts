import { z } from "@hono/zod-openapi";

// Request schemas
export const RoleDetailSchema = z.array(
  z.object({
    slug: z.string(),
    module_name: z.string(),
  }),
);

export const ApplicationRoleSchema = z.array(
  z.object({
    name: z.string(),
    isSuperuserAdmin: z.boolean(),
    roles: RoleDetailSchema,
  }),
);

export const RoleAbilitySchema = z.object({
  sub: z.string(),
  email: z.string(),
  employeeName: z.string(),
  avatar: z.string(),
  apps: ApplicationRoleSchema,
  exp: z.number(),
});
