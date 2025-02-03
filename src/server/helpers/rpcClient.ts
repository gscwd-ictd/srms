import { hc } from "hono/client";
import type { applications, healthcheck } from "@nsa/server/routes";

/**
 * Check for server's health status. This route is not protected, hence a rate limiter
 * is implemented to avoid spam requests.
 */
export const $healthcheck = hc<typeof healthcheck>("/api");

/**
 * Handles the entire process of applying for a new water utility service connection,
 * from initial submission to document verification.
 */
export const $applications = hc<typeof applications>("/api");
