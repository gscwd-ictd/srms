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

const memoPool = new Pool({
  connectionString: "postgres://user:password@host:port/db_name",
});

const memodb = drizzle({ client: memoPool });

export default memodb;
