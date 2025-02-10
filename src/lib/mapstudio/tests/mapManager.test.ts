import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { MapManager } from "../mapManager";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

describe("MapManager", () => {
  let mapManager: MapManager;
  let target: HTMLDivElement;

  beforeEach(() => {
    target = document.createElement("div");
    target.style.width = "100px";
    target.style.height = "100px";
    document.body.appendChild(target);
    mapManager = new MapManager();
  });

  afterEach(() => {
    mapManager.destroy();
    target.remove();
  });

  describe("Initialization", () => {
    test("should initialize map with default options", () => {
      mapManager.init({ target });
      const map = mapManager.getMap();

      expect(map).toBeInstanceOf(Map);
      expect(map.getTarget()).toBe(target);
      expect(map.getView().getZoom()).toBe(2);
      expect(map.getView().getCenter()).toEqual([0, 0]);
    });

    test("should initialize map with custom options", () => {
      const customView = new View({
        center: [10, 20],
        zoom: 5,
      });

      mapManager.init({
        target,
        view: customView,
      });

      const map = mapManager.getMap();
      expect(map.getView().getZoom()).toBe(5);
      expect(map.getView().getCenter()).toEqual([10, 20]);
    });

    test("should throw error when accessing map before initialization", () => {
      expect(() => mapManager.getMap()).toThrow("Map not initialized");
    });
  });

  describe("Map Operations", () => {
    beforeEach(() => {
      mapManager.init({ target });
    });

    test("should set and get center", () => {
      const center = [10, 20];
      mapManager.setCenter(center);
      expect(mapManager.getCenter()).toEqual(center);
    });

    test("should set and get zoom", () => {
      const zoom = 5;
      mapManager.setZoom(zoom);
      expect(mapManager.getZoom()).toBe(zoom);
    });

    test("should fit to extent", () => {
      const extent = [0, 0, 10, 10];
      mapManager.fitToExtent(extent);

      // Get the new extent (will be different but should contain our extent)
      const newExtent = mapManager.getExtent();

      //@ts-expect-error just a type-casting error
      expect(newExtent[0]).toBeLessThanOrEqual(extent[0]);

      //@ts-expect-error just a type-casting error
      expect(newExtent[1]).toBeLessThanOrEqual(extent[1]);

      //@ts-expect-error just a type-casting error
      expect(newExtent[2]).toBeGreaterThanOrEqual(extent[2]);

      //@ts-expect-error just a type-casting error
      expect(newExtent[3]).toBeGreaterThanOrEqual(extent[3]);
    });
  });

  describe("Manager Access", () => {
    test("should provide access to layer manager", () => {
      expect(mapManager.getLayerManager()).toBeDefined();
    });

    test("should provide access to interaction manager", () => {
      expect(mapManager.getInteractionManager()).toBeDefined();
    });

    test("should provide access to control manager", () => {
      expect(mapManager.getControlManager()).toBeDefined();
    });
  });

  describe("Map Integration", () => {
    test("should integrate with layer manager", () => {
      mapManager.init({ target });
      const layerManager = mapManager.getLayerManager();
      const osmLayer = new TileLayer({
        source: new OSM(),
      });

      const initialLayerCount = mapManager.getMap().getLayers().getLength();
      layerManager.addLayer("osm", osmLayer);
      expect(mapManager.getMap().getLayers().getLength()).toBe(initialLayerCount + 1);
    });

    test("should cleanup properly on destroy", () => {
      mapManager.init({ target });
      const layerManager = mapManager.getLayerManager();
      layerManager.addLayer("test", new TileLayer({ source: new OSM() }));

      mapManager.destroy();
      expect(() => mapManager.getMap()).toThrow("Map not initialized");
    });
  });
});
