import { drizzle } from "drizzle-orm/node-mssql";
import env from "@srms/utils/env";
import mssql, { ConnectionPool } from "mssql";

const pool: ConnectionPool = await mssql.connect(env.DB_HOST_MS);

export const db = drizzle({ client: pool });

// export const db = drizzle(env.DB_HOST_MS);

// const result = await db.execute("select 1");

// console.log(result);
