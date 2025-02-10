import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { Map, View } from "ol";
import { Draw, Select, Modify, Snap } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";
import Polygon from "ol/geom/Polygon";
import { InteractionManager } from "../interactionManager";
import BaseEvent from "ol/events/Event";

// Create a custom DrawEvent class for testing
class TestDrawEvent extends BaseEvent {
  feature: Feature;

  constructor(feature: Feature) {
    super("drawend");
    this.feature = feature;
  }
}

describe("InteractionManager", () => {
  let interactionManager: InteractionManager;
  let map: Map;
  let target: HTMLDivElement;
  let testLayer: VectorLayer<VectorSource>;

  beforeEach(() => {
    // Create a target element for the map
    target = document.createElement("div");
    target.style.width = "100px";
    target.style.height = "100px";
    document.body.appendChild(target);

    // Create a test vector layer
    const source = new VectorSource();
    testLayer = new VectorLayer({ source });
    testLayer.set("id", "test-layer");

    map = new Map({
      target,
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
      layers: [testLayer],
    });

    interactionManager = new InteractionManager();
    interactionManager.setMap(map);
  });

  afterEach(() => {
    map.setTarget(undefined);
    target.remove();
  });

  describe("Drawing Interactions", () => {
    test("should enable drawing interaction", () => {
      interactionManager.enableDrawing("Point");
      expect(interactionManager.hasInteraction("draw")).toBe(true);

      const interactions = map.getInteractions().getArray();
      const drawInteraction = interactions.find((i) => i instanceof Draw);
      expect(drawInteraction).toBeDefined();
    });

    test("should enable snapping with default config", () => {
      interactionManager.enableDrawing("Point", true);

      expect(interactionManager.hasInteraction("draw")).toBe(true);
      expect(interactionManager.hasInteraction("snap")).toBe(true);

      const interactions = map.getInteractions().getArray();
      const snapInteraction = interactions.find((i) => i instanceof Snap);
      expect(snapInteraction).toBeDefined();
    });

    test("should enable snapping with custom config", () => {
      const customSource = new VectorSource();
      interactionManager.enableDrawing("Point", {
        pixel: 20,
        edge: false,
        vertex: true,
        source: customSource,
      });

      expect(interactionManager.hasInteraction("snap")).toBe(true);
    });

    test("should handle draw completion for Point", () => {
      interactionManager.enableDrawing("Point", false, (coordinates) => {
        expect(coordinates).toBeDefined();
        expect(coordinates?.length).toBe(1);
      });

      const feature = new Feature(new Point([0, 0]));
      const drawInteraction = map
        .getInteractions()
        .getArray()
        .find((i) => i instanceof Draw) as Draw;

      drawInteraction.dispatchEvent(new TestDrawEvent(feature));
    });

    test("should handle draw completion for LineString", () => {
      interactionManager.enableDrawing("LineString", false, (coordinates) => {
        expect(coordinates).toBeDefined();
        expect(coordinates?.length).toBeGreaterThan(0);
      });

      const feature = new Feature(
        new LineString([
          [0, 0],
          [1, 1],
        ]),
      );
      const drawInteraction = map
        .getInteractions()
        .getArray()
        .find((i) => i instanceof Draw) as Draw;

      drawInteraction.dispatchEvent(new TestDrawEvent(feature));
    });

    test("should handle draw completion for Polygon", () => {
      interactionManager.enableDrawing("Polygon", false, (coordinates) => {
        expect(coordinates).toBeDefined();
        expect(coordinates?.length).toBeGreaterThan(0);
      });

      const feature = new Feature(
        new Polygon([
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 0],
          ],
        ]),
      );
      const drawInteraction = map
        .getInteractions()
        .getArray()
        .find((i) => i instanceof Draw) as Draw;

      drawInteraction.dispatchEvent(new TestDrawEvent(feature));
    });

    test("should disable drawing and remove interactions", () => {
      interactionManager.enableDrawing("Point", true);
      interactionManager.disableDrawing();

      expect(interactionManager.hasInteraction("draw")).toBe(false);
      expect(interactionManager.hasInteraction("snap")).toBe(false);
    });
  });

  describe("Modify Interaction", () => {
    test("should enable modify interaction for existing layer", () => {
      interactionManager.enableModify("test-layer");
      expect(interactionManager.hasInteraction("modify")).toBe(true);

      const interactions = map.getInteractions().getArray();
      const modifyInteraction = interactions.find((i) => i instanceof Modify);
      expect(modifyInteraction).toBeDefined();
    });

    test("should throw error when enabling modify for non-existent layer", () => {
      expect(() => {
        interactionManager.enableModify("non-existent-layer");
      }).toThrow("Layer with id non-existent-layer not found");
    });
  });

  describe("Select Interaction", () => {
    test("should enable select interaction", () => {
      interactionManager.enableSelect();
      expect(interactionManager.hasInteraction("select")).toBe(true);

      const interactions = map.getInteractions().getArray();
      const selectInteraction = interactions.find((i) => i instanceof Select);
      expect(selectInteraction).toBeDefined();
    });

    test("should not create duplicate select interaction", () => {
      interactionManager.enableSelect();
      interactionManager.enableSelect();

      const interactions = map.getInteractions().getArray();
      const selectInteractions = interactions.filter((i) => i instanceof Select);
      expect(selectInteractions).toHaveLength(1);
    });

    test("should get selected features", () => {
      interactionManager.enableSelect();
      expect(interactionManager.getSelectedFeatures()).toHaveLength(0);
    });

    test("should disable select interaction", () => {
      interactionManager.enableSelect();
      interactionManager.disableSelect();

      expect(interactionManager.hasInteraction("select")).toBe(false);
    });
  });

  describe("General Management", () => {
    test("should clear all interactions", () => {
      interactionManager.enableDrawing("Point");
      interactionManager.enableSelect();

      interactionManager.clear();

      expect(interactionManager.getInteractionIds()).toHaveLength(0);
    });

    test("should manage drawing layer", () => {
      const drawingLayer = interactionManager.getDrawingLayer();
      expect(map.getLayers().getArray()).toContain(drawingLayer);

      const source = interactionManager.getDrawingSource();
      expect(drawingLayer.getSource()).toBe(source);
    });
  });
});
