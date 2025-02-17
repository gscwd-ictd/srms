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
  coordinates: z.array(z.array(z.array(z.array(z.number())))),
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

export const FeatureStylesSchema = z.object({
  fillColor: z
    .string()
    .openapi({
      description: "Fill color of the polygon.",
      default: "rgb(197, 202, 233, 0.4)",
    })
    .default("rgb(197, 202, 233, 0.4)"),
  strokeColor: z
    .string()
    .openapi({
      description: "Color of the polygon's outline.",
      default: "rgb(79, 70, 229, 1.0)",
    })
    .default("rgb(79, 70, 229, 1.0)"),
  strokeWidth: z
    .array(z.number())
    .openapi({
      description: "Thickness of the polygon's outline, in pixels.",
      default: [3],
    })
    .default([3]),
  outlineStyle: z
    .union([z.literal("solid"), z.literal("dashed")])
    .openapi({
      description: "Style of the polygon's outline (solid or dashed).",
      default: "solid",
    })
    .default("solid"),
  freehand: z
    .boolean()
    .openapi({
      description: "Enables freehand drawing mode, overriding snapping behavior.",
      default: false,
    })
    .default(false),
  enableSnapping: z
    .boolean()
    .openapi({
      description: "Enables snapping to existing geometries.",
      default: true,
    })
    .default(true),
  snapTolerance: z
    .array(z.number())
    .openapi({
      description: "Distance threshold for snapping, in pixels.",
      default: [7],
    })
    .default([7]),
  snapToEdge: z
    .boolean()
    .openapi({
      description: "Determines whether snapping should occur along polygon edges.",
      default: true,
    })
    .default(true),
  snapToVertex: z
    .boolean()
    .openapi({
      description: "Determines whether snapping should occur at polygon vertices.",
      default: true,
    })
    .default(true),
});
