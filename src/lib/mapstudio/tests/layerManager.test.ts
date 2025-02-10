import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import { LayerManager } from "../layerManager";

describe("LayerManager", () => {
  let layerManager: LayerManager;
  let map: Map;
  let target: HTMLDivElement;

  beforeEach(() => {
    // Create a target element for the map
    target = document.createElement("div");
    target.style.width = "100px";
    target.style.height = "100px";
    document.body.appendChild(target);

    // Setup fresh instances before each test
    map = new Map({
      target,
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
      layers: [],
    });

    layerManager = new LayerManager();
    layerManager.setMap(map);
  });

  afterEach(() => {
    // Cleanup
    map.setTarget(undefined);
    target.remove();
  });

  describe("Basic Layer Operations", () => {
    test("should add a layer successfully", () => {
      const osmLayer = new TileLayer({
        source: new OSM(),
      });

      layerManager.addLayer("osm", osmLayer);
      expect(layerManager.getLayer("osm")).toBe(osmLayer);
      expect(map.getLayers().getLength()).toBe(1);
    });

    test("should throw error when adding duplicate layer ID", () => {
      const layer1 = new TileLayer({ source: new OSM() });
      const layer2 = new TileLayer({ source: new OSM() });

      layerManager.addLayer("base", layer1);
      expect(() => {
        layerManager.addLayer("base", layer2);
      }).toThrowError("Layer with id base already exists");
    });

    test("should remove layer successfully", () => {
      const layer = new TileLayer({ source: new OSM() });
      layerManager.addLayer("test", layer);

      layerManager.removeLayer("test");
      expect(layerManager.getLayer("test")).toBeUndefined();
      expect(map.getLayers().getLength()).toBe(0);
    });

    test("should handle removing non-existent layer", () => {
      expect(() => {
        layerManager.removeLayer("nonexistent");
      }).not.toThrow();
    });
  });

  describe("Layer Visibility and Opacity", () => {
    test("should set layer visibility", () => {
      const layer = new TileLayer({ source: new OSM() });
      layerManager.addLayer("test", layer);

      layerManager.setLayerVisibility("test", false);
      expect(layer.getVisible()).toBe(false);

      layerManager.setLayerVisibility("test", true);
      expect(layer.getVisible()).toBe(true);
    });

    test("should set layer opacity", () => {
      const layer = new TileLayer({ source: new OSM() });
      layerManager.addLayer("test", layer);

      layerManager.setLayerOpacity("test", 0.5);
      expect(layer.getOpacity()).toBe(0.5);
    });

    test("should clamp opacity values", () => {
      const layer = new TileLayer({ source: new OSM() });
      layerManager.addLayer("test", layer);

      layerManager.setLayerOpacity("test", 1.5);
      expect(layer.getOpacity()).toBe(1);

      layerManager.setLayerOpacity("test", -0.5);
      expect(layer.getOpacity()).toBe(0);
    });
  });

  describe("Layer Groups", () => {
    test("should create and manage layer groups", () => {
      const layer1 = new TileLayer({ source: new OSM() });
      const layer2 = new VectorLayer({ source: new VectorSource() });

      const group = layerManager.createLayerGroup("testGroup", [layer1]);
      layerManager.addLayer("vector", layer2, "testGroup");

      expect(group.getLayers().getLength()).toBe(2);
    });

    test("should remove layer group", () => {
      const group = layerManager.createLayerGroup("testGroup");

      // Verify group was created and added to map
      expect(map.getLayers().getLength()).toBe(1);
      expect(map.getLayers().item(0)).toBe(group);

      layerManager.removeLayerGroup("testGroup");

      // Verify group was removed
      expect(map.getLayers().getLength()).toBe(0);
      expect(layerManager.getGroupIds()).toHaveLength(0);
    });

    test("should throw error for duplicate group ID", () => {
      layerManager.createLayerGroup("group1");
      expect(() => {
        layerManager.createLayerGroup("group1");
      }).toThrowError("Layer group with id group1 already exists");
    });
  });

  describe("Layer Ordering", () => {
    test("should set layer index correctly", () => {
      const layer1 = new TileLayer({ source: new OSM() });
      const layer2 = new TileLayer({ source: new OSM() });

      layerManager.addLayer("base", layer1);
      layerManager.addLayer("overlay", layer2);

      layerManager.setLayerIndex("base", 1);
      expect(layerManager.getLayerPosition("base")).toBe(1);
      expect(layerManager.getLayerPosition("overlay")).toBe(0);
    });

    test("should move layer up and down", () => {
      const layer1 = new TileLayer({ source: new OSM() });
      const layer2 = new TileLayer({ source: new OSM() });
      const layer3 = new TileLayer({ source: new OSM() });

      layerManager.addLayer("layer1", layer1);
      layerManager.addLayer("layer2", layer2);
      layerManager.addLayer("layer3", layer3);

      expect(layerManager.moveLayerUp("layer1")).toBe(true);
      expect(layerManager.getLayerPosition("layer1")).toBe(1);

      expect(layerManager.moveLayerDown("layer3")).toBe(true);
      expect(layerManager.getLayerPosition("layer3")).toBe(1);
    });
  });

  describe("Clear and Reset", () => {
    test("should clear all layers and groups", () => {
      const layer1 = new TileLayer({ source: new OSM() });
      const layer2 = new VectorLayer({ source: new VectorSource() });

      layerManager.addLayer("tile", layer1);
      layerManager.createLayerGroup("group1", [layer2]);

      layerManager.clear();
      expect(map.getLayers().getLength()).toBe(0);
      expect(layerManager.getLayerIds()).toHaveLength(0);
      expect(layerManager.getGroupIds()).toHaveLength(0);
    });
  });
});
