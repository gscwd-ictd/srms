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
  DB_HOST_GIS: z.string(),
  DB_PORT_GIS: z.coerce.number().default(5432),
  DB_PASS_GIS: z.string(),
  DB_USER_GIS: z.string(),
  NEXT_PUBLIC_GEOSERVER_URL: z.string(),
  NEXT_PUBLIC_GEOSERVER_WORKSPACE: z.string(),
  NEXT_PUBLIC_GEOSERVER_USERNAME: z.string(),
  NEXT_PUBLIC_GEOSERVER_PASSWORD: z.string(),
  VALVE_LAYER_NAME: z.string(),
  MINIO_ENDPOINT: z.string(),
  MINIO_PORT: z.coerce.number(),
  MINIO_ACCESS_KEY: z.string(),
  MINIO_SECRET: z.string(),
  MINIO_USE_SSL: z.string(),
  MINIO_BUCKET: z.string(),
  NEXT_PUBLIC_MAPTILER_KEY: z.string(),
  NEXT_PUBLIC_BING_KEY: z.string(),
  TRACKSOLID_URL: z.string(),
  TRACKSOLID_APP_KEY: z.string(),
  TRACKSOLID_APP_SECRET: z.string(),
  TRACKSOLID_USER: z.string(),
  TRACKSOLID_PASSWORD: z.string(),
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
