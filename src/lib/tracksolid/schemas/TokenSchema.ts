import { z } from "@hono/zod-openapi";

export const SelectAccessTokenSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: z.object({
    appKey: z.string(),
    account: z.string(),
    accessToken: z.string(),
    refreshToken: z.string(),
    expiresIn: z.number(),
    time: z.string(),
  }),
  data: z.string(),
});

export const SelectRefreshTokenSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: z.object({
    appKey: z.string(),
    account: z.string(),
    accessToken: z.string(),
    expiresIn: z.number(),
    refreshToken: z.string(),
    time: z.string(),
  }),
  data: z.string(),
});

export const ErrorRefreshTokenSchema = z.object({
  error: z.boolean(),
  message: z.string(),
});
