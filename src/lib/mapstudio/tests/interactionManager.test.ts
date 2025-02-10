import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { Map, View } from "ol";
import { Draw, Modify, Select } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { InteractionManager } from "../interactionManager";

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

    test("should disable drawing interaction", () => {
      interactionManager.enableDrawing("Point");
      interactionManager.disableDrawing();

      expect(interactionManager.hasInteraction("draw")).toBe(false);
      const interactions = map.getInteractions().getArray();
      const drawInteraction = interactions.find((i) => i instanceof Draw);
      expect(drawInteraction).toBeUndefined();
    });

    test("should replace existing drawing interaction when enabling new one", () => {
      interactionManager.enableDrawing("Point");
      interactionManager.enableDrawing("LineString");

      const interactions = map.getInteractions().getArray();
      const drawInteractions = interactions.filter((i) => i instanceof Draw);
      expect(drawInteractions).toHaveLength(1);
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
      }).toThrowError("Layer with id non-existent-layer not found");
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

      // Add a feature to the test layer and simulate selection
      const feature = new Feature(new Point([0, 0]));
      testLayer.getSource()?.addFeature(feature);

      const selectInteraction = map
        .getInteractions()
        .getArray()
        .find((i) => i instanceof Select) as Select;
      selectInteraction.getFeatures().push(feature);

      expect(interactionManager.getSelectedFeatures()).toHaveLength(1);
      expect(interactionManager.getSelectedFeatures()[0]).toBe(feature);
    });
  });

  describe("General Management", () => {
    test("should clear all interactions", () => {
      interactionManager.enableDrawing("Point");
      interactionManager.enableSelect();

      interactionManager.clear();

      expect(interactionManager.getInteractionIds()).toHaveLength(0);
      expect(
        map
          .getInteractions()
          .getArray()
          .filter((i) => i instanceof Draw || i instanceof Select),
      ).toHaveLength(0);
    });

    test("should manage drawing layer", () => {
      const drawingLayer = interactionManager.getDrawingLayer();
      expect(map.getLayers().getArray()).toContain(drawingLayer);

      const source = interactionManager.getDrawingSource();
      expect(drawingLayer.getSource()).toBe(source);
    });
  });
});
