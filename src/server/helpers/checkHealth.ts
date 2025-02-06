import { sql } from "drizzle-orm/sql";
import { db } from "../db/postgres";
import { format, formatDistanceStrict } from "date-fns";
import { HealthCheckResponse } from "../types";
import packageJson from "@/package.json";

function formatUptime(seconds: number): string {
  const now = new Date();
  const uptimeDate = new Date(now.getTime() - seconds * 1000);
  return formatDistanceStrict(now, uptimeDate, { addSuffix: false });
}

async function checkPgHealth() {
  const startTime = performance.now();

  try {
    const metrics = await db.execute(sql`
        SELECT 
          numbackends as connection_count,
          setting as max_connections
        FROM pg_stat_database, pg_settings
        WHERE datname = current_database()
        AND name = 'max_connections'
      `);

    const endTime = performance.now();

    return {
      status: "up" as const,
      responseTime: Math.round(endTime - startTime),
      connectionCount: metrics.rows[0].connection_count as number,
      maxConnections: parseInt(metrics.rows[0].max_connections as string),
    };
  } catch (error) {
    console.error(error);

    return {
      status: "down" as const,
      responseTime: Math.round(performance.now() - startTime),
      connectionCount: 0,
      maxConnections: 0,
    };
  }
}

export async function checkHealth(): Promise<HealthCheckResponse> {
  const dbHealth = await checkPgHealth();

  const memoryUsage = process.memoryUsage();

  return {
    status: dbHealth.status === "up" ? "healthy" : "unhealthy",
    datetime: format(new Date(), "EEEE, MMMM do yyyy, h:mm:ss a zzz"),
    version: packageJson.version,
    environment: process.env.NODE_ENV,
    database: dbHealth,
    // redis: redisHealth,
    uptime: formatUptime(process.uptime()),
    memory: {
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      free: Math.round((memoryUsage.heapTotal - memoryUsage.heapUsed) / 1024 / 1024),
    },
  };
}
