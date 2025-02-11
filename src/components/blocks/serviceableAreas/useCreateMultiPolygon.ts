"use client";

import { GeoJSONMultiPolygon, Position2D } from "@srms/server/types";

export function useCreateMultiPolygon(polygons: Position2D[][]): GeoJSONMultiPolygon {
  return {
    type: "MultiPolygon",
    coordinates: polygons.map((polygon) => [polygon]),
  };
}
