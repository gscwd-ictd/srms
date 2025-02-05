import { z } from "zod";

// redis: {
//   status: 'up' | 'down';
//   responseTime: number;
//   usedMemory: string;
//   totalMemory: string;
//   connectedClients: number;
// };

export const HealthCheckResponseSchema = z.object({
  status: z.literal("healthy").or(z.literal("unhealthy")),
  timestamp: z.string(),
  version: z.string(),
  environment: z.string(),
  database: z.object({
    status: z.literal("up").or(z.literal("down")),
    responseTime: z.number(),
    connectionCount: z.number(),
    maxConnections: z.number(),
  }),
  redis: z.object({
    status: z.literal("up").or(z.literal("down")),
    responseTime: z.number(),
    usedMemory: z.string(),
    totalMemory: z.string(),
    connectedClients: z.number(),
  }),
  uptime: z.string(),
  memory: z.object({
    used: z.number(),
    total: z.number(),
    free: z.number(),
  }),
});
