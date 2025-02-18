"use client";

import type { Position2D } from "@srms/server/types";
import { MultiPoint, MultiPolygon } from "ol/geom";
import { useCallback } from "react";

export const useGeo = () => {
  const createMultiPolygonCallback = useCallback((polygons: Position2D[][]): MultiPolygon => {
    const multipolygon = {
      type: "MultiPolygon",
      coordinates: polygons.map((polygon) => [polygon]),
    };

    return new MultiPolygon(multipolygon.coordinates);
  }, []);

  const createMultipointCallback = useCallback((points: Position2D[]): MultiPoint => {
    const multiPoint = {
      type: "MultiPoint",
      coordinates: points,
    };

    return new MultiPoint(multiPoint.coordinates);
  }, []);

  return {
    createMultiPoint: createMultipointCallback,
    createMultiPolygon: createMultiPolygonCallback,
  };
};
