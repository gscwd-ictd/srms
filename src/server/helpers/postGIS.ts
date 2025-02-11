/**
 * Custom PostGIS Geometry Types for Drizzle ORM
 *
 * These types provide a workaround for PostGIS geometry types that aren't
 * directly supported by Drizzle's built-in geometry type.
 */

import { customType } from "drizzle-orm/pg-core";
import {
  GeoJSONLineString,
  GeoJSONMultiPoint,
  GeoJSONMultiPolygon,
  GeoJSONPoint,
  GeoJSONPolygon,
  Position2D,
} from "@srms/server/types";

// MultiPolygon type for complex boundaries (e.g., regions with islands)
export const multiPolygon = customType<{
  data: string; // GeoJSON string
  config: {
    projection?: "4326" | "3857";
  };
}>({
  dataType(config = { projection: "4326" }) {
    return `geometry(MultiPolygon, ${config?.projection})`;
  },
});

// Polygon type for simple boundaries
export const polygon = customType<{
  data: string; // GeoJSON string
  config: {
    projection: "4326" | "3857";
  };
}>({
  dataType(config = { projection: "4326" }) {
    return `geometry(Polygon, ${config?.projection})`;
  },
});

// MultiPoint type for collections of points
export const multiPoint = customType<{
  data: string; // GeoJSON string
}>({
  dataType() {
    return "geometry(MultiPoint, 4326)";
  },
});

// export type GeoJSON = {
//   type: "Polygon" | "MultiPolygon" | "MultiPoint";
//   coordinates: number[][] | number[][][] | number[][][][];
// };

// // Helper type for GeoJSON structures
// export type GeoJSONPolygon = {
//   type: "Polygon";
//   coordinates: number[][][];
// };

// export type GeoJSONMultiPolygon = {
//   type: "MultiPolygon";
//   coordinates: number[][][][];
// };

// export type GeoJSONMultiPoint = {
//   type: "MultiPoint";
//   coordinates: number[][];
// };

/**
 * Usage Example:
 *
 * import { multiPolygon } from './postgis-types';
 *
 * const regions = pgTable('regions', {
 *   id: uuid('id').primaryKey(),
 *   boundary: multiPolygon('boundary').notNull(),
 * });
 *
 * // Inserting data:
 * const regionData = {
 *   boundary: JSON.stringify({
 *     type: "MultiPolygon",
 *     coordinates: [[[[lng1, lat1], [lng2, lat2], ...]]]
 *   })
 * };
 *
 * await db.insert(regions).values(regionData);
 *
 * Note: The GeoJSON must be stringified before insertion.
 * PostGIS will automatically parse the GeoJSON string into its internal geometry format.
 */

export function createLineString(points: Position2D[]): GeoJSONLineString {
  return {
    type: "LineString",
    coordinates: points,
  };
}

export function createPoint(point: Position2D): GeoJSONPoint {
  return {
    type: "Point",
    coordinates: point,
  };
}

// Helper function to create a GeoJSON polygon
export function createPolygon(coordinates: Position2D[]): GeoJSONPolygon {
  return {
    type: "Polygon",
    coordinates: [coordinates],
  };
}

// Helper function to create a GeoJSON multipolygon
export function createMultiPolygon(polygons: Position2D[][]): GeoJSONMultiPolygon {
  return {
    type: "MultiPolygon",
    coordinates: polygons.map((polygon) => [polygon]),
  };
}

// Helper function to create a GeoJSON multipoint
export function createMultiPoint(points: Position2D[]): GeoJSONMultiPoint {
  return {
    type: "MultiPoint",
    coordinates: points,
  };
}
