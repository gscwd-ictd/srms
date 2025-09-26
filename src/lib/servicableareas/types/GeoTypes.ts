import { z } from "zod";
import {
  FeatureCollectionSchema,
  FeatureSchema,
  GeometrySchema,
  LineStringSchema,
  MultiLineStringSchema,
  MultiPointSchema,
  MultiPolygonSchema,
  PointSchema,
  PolygonSchema,
  Position2DSchema,
  Position3DSchema,
  PositionSchema,
} from "../schemas";

export type Position2D = z.infer<typeof Position2DSchema>;
export type Position3D = z.infer<typeof Position3DSchema>;
export type Position = z.infer<typeof PositionSchema>;
export type Point = z.infer<typeof PointSchema>;
export type LineString = z.infer<typeof LineStringSchema>;
export type Polygon = z.infer<typeof PolygonSchema>;
export type MultiPoint = z.infer<typeof MultiPointSchema>;
export type MultiLineString = z.infer<typeof MultiLineStringSchema>;
export type MultiPolygon = z.infer<typeof MultiPolygonSchema>;
export type Geometry = z.infer<typeof GeometrySchema>;
export type Feature = z.infer<typeof FeatureSchema>;
export type FeatureCollection = z.infer<typeof FeatureCollectionSchema>;

export type GeoJSON =
  | GeoJSONPoint
  | GeoJSONLineString
  | GeoJSONPolygon
  | GeoJSONMultiPolygon
  | GeoJSONMultiPoint;

export type GeoJSONPolygon = {
  type: "Polygon";
  coordinates: Position2D[][];
};

export type GeoJSONMultiPolygon = {
  type: "MultiPolygon";
  coordinates: number[][][][];
};

export type GeoJSONMultiPoint = {
  type: "MultiPoint";
  coordinates: number[][];
};

export type GeoJSONLineString = {
  type: "LineString";
  coordinates: Position2D[];
};

export type GeoJSONPoint = {
  type: "Point";
  coordinates: Position2D;
};
