import Collection from "ol/Collection";
import { Coordinate } from "ol/coordinate";
import { Point, Polygon } from "ol/geom";
import { Draw } from "ol/interaction";
import BaseLayer from "ol/layer/Base";
import VectorLayer from "ol/layer/Vector";
import Map, { MapOptions } from "ol/Map";
import { fromLonLat, toLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import View from "ol/View";

export class MapStudio {
  private map: Map | undefined;
  private view: View | undefined;
  private vectorSource: VectorSource;
  private vectorLayer: VectorLayer<VectorSource>;
  private drawInteraction: Draw | null;

  constructor(private options: MapOptions = {}) {
    this.map = undefined;
    this.view = undefined;
    this.drawInteraction = null;
    this.vectorSource = new VectorSource();
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: {
        "fill-color": "rgba(255, 255, 255, 0.2)",
        "stroke-color": "#ffcc33",
        "stroke-width": 2,
      },
    });
  }

  // Core initialization methods
  initialize(): this {
    // Handle layers properly with Collection
    const layers =
      this.options.layers instanceof Collection
        ? this.options.layers
        : new Collection(this.options.layers as BaseLayer[]);

    layers.push(this.vectorLayer);

    this.map = new Map({
      ...this.options,
      layers,
    });

    this.view = this.map.getView();

    this.map.renderSync();

    return this;
  }

  destroy() {
    if (this.map) {
      this.stopDrawing();
      this.map.setTarget(undefined);
      this.map.setProperties({});
      this.map = undefined;
      this.view = undefined;
    }
  }

  getMap(): Map | undefined {
    return this.map;
  }

  getView(): View | undefined {
    return this.view;
  }

  startDrawing(onComplete?: (coordinates: Coordinate[] | undefined) => void): void {
    if (!this.map) {
      throw new Error("Map not initialized. Call initialize() first.");
    }

    // Remove existing draw interaction if any
    this.stopDrawing();

    // Create new draw interaction
    this.drawInteraction = new Draw({
      source: this.vectorSource,
      type: "Polygon",
    });

    // Add completion handler if provided
    if (onComplete) {
      this.drawInteraction.on("drawend", (event) => {
        const feature = event.feature;
        const geometry = feature.getGeometry();

        if (geometry instanceof Polygon) {
          const coordinates = geometry.getCoordinates()[0];
          onComplete(coordinates);
        }

        // Automatically stop drawing after completion
        this.stopDrawing();
      });
    }

    // Add the interaction to the map
    this.map.addInteraction(this.drawInteraction);
  }

  stopDrawing(): void {
    if (this.map && this.drawInteraction) {
      this.map.removeInteraction(this.drawInteraction);
      this.drawInteraction = null;
    }
  }

  isDrawing(): boolean {
    return this.drawInteraction !== null;
  }

  clearDrawings(): void {
    if (this.vectorSource) {
      this.vectorSource.clear();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private clickListener: ((event: any) => void) | null = null;

  onClick(callback: (coordinate: Coordinate) => void): void {
    if (!this.map) {
      throw new Error("Map not initialized. Call initialize() first.");
    }

    // Remove existing click listener if any
    this.offClick();

    // Create and store the listener function
    this.clickListener = (event) => {
      const clickedCoord = event.coordinate;
      const transformedCoord = toLonLat(clickedCoord);
      callback(transformedCoord);
    };

    // Add the listener to the map
    this.map.on("click", this.clickListener);
  }

  offClick(): void {
    if (this.map && this.clickListener) {
      this.map.un("click", this.clickListener);
      this.clickListener = null;
    }
  }

  isCoordinateInPolygon(coordinate: Coordinate, polygonCoordinates: number[][]): boolean {
    // Create a polygon from the coordinates
    const polygon = new Polygon([polygonCoordinates]);

    // Create a point from the coordinate
    const point = new Point(fromLonLat(coordinate));

    // Check if the point is inside the polygon
    return polygon.intersectsCoordinate(point.getCoordinates());
  }
}
