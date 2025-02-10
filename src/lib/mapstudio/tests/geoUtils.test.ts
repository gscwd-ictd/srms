import { describe, it, expect, vi } from "vitest";
import { GeoUtils } from "../geoUtils";

// Mocking OpenLayers dependencies if necessary
vi.mock("ol/proj", () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform: vi.fn((coords, fromProj, toProj) => coords.map((c: number) => c + 1)),
  get: vi.fn((proj) => proj || null),
  fromLonLat: vi.fn((coords) => coords),
}));

vi.mock("ol/sphere", () => ({
  getDistance: vi.fn((p1, p2) => Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2)),
}));

vi.mock("ol/extent", () => ({
  boundingExtent: vi.fn((coords) => [coords[0][0], coords[0][1], coords[1][0], coords[1][1]]),
  containsCoordinate: vi.fn((extent, point) => {
    const [minX, minY, maxX, maxY] = extent;
    const [x, y] = point;
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  }),
}));

describe("GeoUtils", () => {
  it("should transform coordinates correctly", () => {
    expect(GeoUtils.transformCoordinates([10, 20], "EPSG:4326", "EPSG:3857")).toEqual([11, 21]);
  });

  it("should calculate distance correctly", () => {
    expect(GeoUtils.calculateDistance([0, 0], [3, 4])).toBeCloseTo(5);
  });

  it("should create a bounding box correctly", () => {
    expect(
      GeoUtils.createBoundingBox([
        [0, 0],
        [10, 10],
      ]),
    ).toEqual([0, 0, 10, 10]);
  });

  it("should convert meters to pixels correctly", () => {
    expect(GeoUtils.metersToPixels(100, 45, 10)).toBeGreaterThan(0);
  });

  it("should convert pixels to meters correctly", () => {
    expect(GeoUtils.pixelsToMeters(100, 45, 10)).toBeGreaterThan(0);
  });

  it("should format coordinates correctly", () => {
    expect(GeoUtils.formatCoordinates([10.123456789, 20.987654321], 4)).toEqual([10.1235, 20.9877]);
  });

  it("should validate coordinates correctly", () => {
    expect(GeoUtils.isValidCoordinate([10, 20])).toBe(true);
    expect(GeoUtils.isValidCoordinate([200, 20])).toBe(false);
    expect(GeoUtils.isValidCoordinate([10])).toBe(false);
  });

  it("should check if point is in boundary", () => {
    const boundaries = [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
      [0, 0],
    ];
    expect(GeoUtils.isPointInBoundary([5, 5], boundaries)).toBe(true);
    expect(GeoUtils.isPointInBoundary([15, 15], boundaries)).toBe(false);
  });

  it("should check if point is in extent", () => {
    expect(GeoUtils.isPointInExtent([5, 5], [0, 0, 10, 10])).toBe(true);
    expect(GeoUtils.isPointInExtent([15, 15], [0, 0, 10, 10])).toBe(false);
  });
});
