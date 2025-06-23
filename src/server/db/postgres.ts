import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import env from "@srms/utils/env";
import * as schemas from "@srms/server/db/schemas";

const pool = new Pool({
  connectionString: `postgres://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
});

export const db = drizzle({
  client: pool,
  logger: true,
  schema: {
    ...schemas,
  },
});

const gisPool = new Pool({
  connectionString: `postgres://${env.DB_USER_GIS}:${env.DB_PASS_GIS}@${env.DB_HOST_GIS}:${env.DB_PORT_GIS}/${env.DB_NAME}`,
});

export const gisdb = drizzle({ client: gisPool });
