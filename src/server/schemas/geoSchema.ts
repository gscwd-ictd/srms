import { z } from "zod";

// Position schemas
export const Position2DSchema = z.tuple([z.number(), z.number()]);
export const Position3DSchema = z.tuple([z.number(), z.number(), z.number()]);
export const PositionSchema = z.union([Position2DSchema, Position3DSchema]);

// Point schema
export const PointSchema = z.object({
  type: z.literal("Point"),
  coordinates: PositionSchema,
});

// LineString schema
export const LineStringSchema = z.object({
  type: z.literal("LineString"),
  coordinates: z.array(PositionSchema),
});

// Polygon schema (array of linear rings, first is exterior, rest are holes)
export const PolygonSchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(z.array(PositionSchema)),
});

// MultiPoint schema
export const MultiPointSchema = z.object({
  type: z.literal("MultiPoint"),
  coordinates: z.array(PositionSchema),
});

// MultiLineString schema
export const MultiLineStringSchema = z.object({
  type: z.literal("MultiLineString"),
  coordinates: z.array(z.array(PositionSchema)),
});

// MultiPolygon schema
export const MultiPolygonSchema = z.object({
  type: z.literal("MultiPolygon"),
  coordinates: z.array(z.array(z.array(PositionSchema))),
});

// Combined GeoJSON geometry schema
export const GeometrySchema = z.discriminatedUnion("type", [
  PointSchema,
  LineStringSchema,
  PolygonSchema,
  MultiPointSchema,
  MultiLineStringSchema,
  MultiPolygonSchema,
]);

// Feature schema
export const FeatureSchema = z.object({
  type: z.literal("Feature"),
  geometry: GeometrySchema,
  properties: z.record(z.any()).nullable(),
});

// FeatureCollection schema
export const FeatureCollectionSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(FeatureSchema),
});
