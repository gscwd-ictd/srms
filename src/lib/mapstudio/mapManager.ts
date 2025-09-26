import Map, { MapOptions } from "ol/Map";
import { defaults as defaultInteractions } from "ol/interaction";
import { LayerManager } from "./layerManager";
import { InteractionManager } from "./interactionManager";
import { ControlManager } from "./controlManager";
import { Coordinate } from "ol/coordinate";
import { MapBrowserEvent, View } from "ol";
import { Extent } from "ol/extent";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { MapEvents } from "./utils/mapEvents";
import { FitOptions } from "ol/View";

export class MapManager {
  private map: Map | undefined;
  private layerManager: LayerManager;
  private interactionManager: InteractionManager;
  private controlManager: ControlManager;

  constructor() {
    this.map = undefined;
    this.layerManager = new LayerManager();
    this.interactionManager = new InteractionManager();
    this.controlManager = new ControlManager();
  }

  public init(options?: MapOptions): this {
    if (!options?.target) {
      throw new Error("The map has no container!");
    }

    this.map = new Map({
      ...options,
      target: options.target,

      controls: [],

      layers: options.layers || [
        new TileLayer({
          source: new OSM(),
        }),
      ],

      view:
        options.view ||
        new View({
          center: [0, 0],
          zoom: 2,
        }),

      interactions: defaultInteractions({
        doubleClickZoom: true,
        dragPan: true,
        mouseWheelZoom: true,
      }),
    });

    // Initialize all managers with the map instance
    this.layerManager.setMap(this.map);
    this.interactionManager.setMap(this.map);
    this.controlManager.setMap(this.map);

    this.map.renderSync();

    return this;
  }

  public getMap() {
    if (!this.map) {
      throw new Error("Map not initialized. Call init() first.");
    }

    return this.map;
  }

  public getLayerManager(): LayerManager {
    return this.layerManager;
  }

  public getInteractionManager(): InteractionManager {
    return this.interactionManager;
  }

  public getControlManager(): ControlManager {
    return this.controlManager;
  }

  public setCenter(coordinates: Coordinate): void {
    if (!this.map) {
      throw new Error("Map not initialized. Call init() first.");
    }

    this.map.getView().setCenter(coordinates);
  }

  public setZoom(level: number): void {
    if (!this.map) {
      throw new Error("Map not initialized. Call init() first.");
    }

    this.map.getView().setZoom(level);
  }

  public fitToExtent(extent?: Extent, options?: FitOptions): void {
    if (!this.map) {
      throw new Error("Map not initialized. Call init() first.");
    }

    if (extent) {
      this.map.getView().fit(extent, options);
    }
  }

  public getCenter(): Coordinate {
    if (!this.map) {
      throw new Error("Map not initialized. Call init() first.");
    }
    return this.map.getView().getCenter() as Coordinate;
  }

  public getZoom(): number {
    if (!this.map) {
      throw new Error("Map not initialized. Call init() first.");
    }
    return this.map.getView().getZoom() as number;
  }

  public getExtent(): Extent {
    if (!this.map) {
      throw new Error("Map not initialized. Call init() first.");
    }
    return this.map.getView().calculateExtent(this.map.getSize());
  }

  // (event: MapBrowserEvent<any>) => unknown
  public addMapEvent(
    eventType: (typeof MapEvents)[number],
    callback: (event: MapBrowserEvent<UIEvent>) => void,
  ): void {
    if (!this.map) {
      throw new Error("Map not initialized. Call init() first.");
    }

    //@ts-expect-error type mismatch only
    this.map.on([eventType], callback);
  }

  public destroy(): void {
    if (this.map) {
      // Clean up managers
      this.layerManager.clear();
      this.interactionManager.clear();
      this.controlManager.clear();

      // Remove the map
      this.map.setTarget(undefined);
      this.map = undefined;
    }
  }
}
