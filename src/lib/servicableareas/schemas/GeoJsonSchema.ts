import { z } from "zod";
import ValveThrottle from "../../../../public/images/valve_throttle.svg";

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

export const IconStylesSchema = z.object({
  src: z
    .string()
    .openapi({
      description: "Icon to be used as valve marker.",
      default: ValveThrottle,
    })
    .default(ValveThrottle),
  anchor: z
    .array(z.number())
    .openapi({
      description: "Offsetting position of icon in relevance to the valve coordinates",
      default: [0.5, 0.5],
    })
    .default([0.5, 0.5]),
  scale: z
    .number()
    .openapi({
      description: "Scale size of icon.",
      default: 0.8,
    })
    .default(0.8),
  rotation: z
    .number()
    .openapi({
      description: "Rotation of icon",
      default: 0,
    })
    .optional(),
});

export const MarkerStylesSchema = z.object({
  radius: z
    .number()
    .openapi({
      description: "Marker radius.",
      default: 10,
    })
    .default(10),
  fillColor: z.string().openapi({
    description: "Color of the marker",
    default: "rgb(20, 88, 252, 1.0)",
  }),
  strokeColor: z
    .string()
    .openapi({
      description: "Color of the line's outline.",
      default: "rgb(79, 70, 229, 1.0)",
    })
    .default("rgb(1, 40, 133, 1.0)"),
  strokeWidth: z
    .number()
    .openapi({
      description: "Thickness of the polygon's outline, in pixels.",
      default: 3,
    })
    .default(3),
});

export const LineStringStylesSchema = z.object({
  strokeColor: z
    .string()
    .openapi({
      description: "Color of the line's outline.",
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
      description: "Style of the line's outline (solid or dashed).",
      default: "solid",
    })
    .default("solid")
    .optional(),
});

export const LabelStylesSchema = z.object({
  font: z
    .string()
    .openapi({
      description: "Font and size to be used.",
      default: "12px Calibri,sans-serif",
    })
    .default("12px Calibri,sans-serif"),
  overflow: z
    .boolean()
    .openapi({
      description: "Enables content overflow.",
      default: false,
    })
    .default(false),
  fillColor: z
    .string()
    .openapi({
      description: "Color of font",
      default: "#000",
    })
    .default("#000"),
  strokeColor: z
    .string()
    .openapi({
      description: "Color of text outline",
      default: "#fff",
    })
    .default("#fff"),
  width: z
    .number()
    .openapi({
      description: "Width of text outline",
      default: 2,
    })
    .default(2),
  offsetY: z
    .number()
    .openapi({
      description: "Y axis offset of label",
      default: 0,
    })
    .default(0),
  text: z
    .string()
    .openapi({
      description: "Text to be used as label.",
      default: "",
    })
    .default(""),
});
