import env from "@nsa/utils/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schemas from "@nsa/server/db/schemas";

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
