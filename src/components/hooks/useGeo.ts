"use client";

import { MultiPoint, MultiPolygon } from "ol/geom";
import { useCallback } from "react";

export const useGeo = () => {
  const createMultiPolygonCallback = useCallback((polygons: number[][][]): MultiPolygon => {
    const multipolygon = {
      type: "MultiPolygon",
      coordinates: polygons.map((polygon) => [polygon]),
    };

    return new MultiPolygon(multipolygon.coordinates);
  }, []);

  const createMultipointCallback = useCallback((points: number[]): MultiPoint => {
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
