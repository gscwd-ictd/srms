import { pinoLogger as logger } from "hono-pino";
import pino from "pino";
import pretty from "pino-pretty";
import env from "@nsa/utils/env";

export function pinoLogger() {
  return logger({
    pino: pino(
      {
        level: env.LOG_LEVEL,
      },
      process.env.NODE_ENV === "production"
        ? undefined
        : pretty({
            colorize: true,
            colorizeObjects: true,
          }),
    ),
  });
}
