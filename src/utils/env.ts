import { z, ZodError } from "zod";

/**
 * Define all you env variables in this schema to get full type-safety in accessing them.
 */
const EnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string(),
  NEXT_PUBLIC_APP_DOCS_URL: z.string(),
  LOG_LEVEL: z.enum(["debug", "error", "fatal", "info", "silent", "trace", "warn"]),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(5436),
  DB_PASS: z.string(),
  DB_USER: z.string(),
  DB_NAME: z.string(),
  AUTHORIZATION_SERVER_URL: z.string().url(),
  CLIENT_ID: z.string(),
  CLIENT_SECRET: z.string(),
  REDIRECT_URI: z.string().url(),
});

export type Env = z.infer<typeof EnvSchema>;

let env: Env;

try {
  env = EnvSchema.parse(process.env);
} catch (error) {
  const zodError = error as ZodError;
  console.error(zodError.flatten().fieldErrors);

  process.exit(1);
}

export default env;
