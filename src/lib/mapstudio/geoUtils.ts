import { transform, get as getProjection, fromLonLat } from "ol/proj";
import { getDistance } from "ol/sphere";
import { boundingExtent, containsCoordinate, Extent } from "ol/extent";
import { Coordinate } from "ol/coordinate";
import { Point, Polygon } from "ol/geom";
import wkx from "wkx";
import { GeoJSON } from "@srms/server/types";

export class GeoUtils {
  public static transformCoordinates(coords: number[], fromProj: string, toProj: string): number[] {
    const sourceProj = getProjection(fromProj);
    const targetProj = getProjection(toProj);

    if (!sourceProj || !targetProj) {
      throw new Error("Invalid projection");
    }

    return transform(coords, sourceProj, targetProj);
  }

  public static calculateDistance(point1: number[], point2: number[]): number {
    // getDistance expects coordinates in lon/lat (EPSG:4326)
    return getDistance(point1, point2);
  }

  public static createBoundingBox(coordinates: number[][]): number[] {
    return boundingExtent(coordinates);
  }

  public static metersToPixels(meters: number, latitude: number, zoom: number): number {
    // Earth's radius in meters
    const earthRadius = 6378137;

    // Resolution (meters per pixel) at the equator for zoom level 0
    const resolution0 = (2 * Math.PI * earthRadius) / (256 * Math.pow(2, zoom));

    // Adjust for latitude
    const latAdjustedResolution = resolution0 * Math.cos((latitude * Math.PI) / 180);

    return meters / latAdjustedResolution;
  }

  public static pixelsToMeters(pixels: number, latitude: number, zoom: number): number {
    const earthRadius = 6378137;
    const resolution0 = (2 * Math.PI * earthRadius) / (256 * Math.pow(2, zoom));
    const latAdjustedResolution = resolution0 * Math.cos((latitude * Math.PI) / 180);

    return pixels * latAdjustedResolution;
  }

  public static formatCoordinates(coords: number[], decimals: number = 6): number[] {
    return coords.map((coord) => Number(coord.toFixed(decimals)));
  }

  public static isValidCoordinate(coord: number[]): boolean {
    if (!Array.isArray(coord) || coord.length !== 2) {
      return false;
    }

    const [lon, lat] = coord;
    return (
      typeof lon === "number" &&
      typeof lat === "number" &&
      lon >= -180 &&
      lon <= 180 &&
      lat >= -90 &&
      lat <= 90
    );
  }

  public static isPointInBoundary(location: Coordinate, boundaries: number[][]): boolean {
    // Create a polygon from the coordinates
    const polygon = new Polygon([boundaries]);

    // Create a point from the coordinate
    const point = new Point(fromLonLat(location));

    // Check if the point is inside the polygon
    return polygon.intersectsCoordinate(point.getCoordinates());
  }

  public static isPointInExtent(point: number[], extent: Extent): boolean {
    return containsCoordinate(extent, point);
  }

  public static convertWkbToGeoJson(wkbHex: string) {
    const twkbBuffer = Buffer.from(wkbHex, "hex");
    const geometry = wkx.Geometry.parse(twkbBuffer);
    const geoJson = geometry.toGeoJSON() as GeoJSON;

    return geoJson;
  }
}
