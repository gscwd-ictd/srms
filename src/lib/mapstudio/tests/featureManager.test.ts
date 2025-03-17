import { describe, test, expect, beforeEach } from 'vitest';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';
import { Style, Fill, Circle } from 'ol/style';
import { FeatureManager } from '../featureManager';

describe('FeatureManager', () => {
  let featureManager: FeatureManager;

  beforeEach(() => {
    featureManager = new FeatureManager();
  });

  describe('Feature Creation', () => {
    test('should create a point feature', () => {
      const geometry = new Point([0, 0]);
      const properties = { name: 'Test Point' };

      const feature = featureManager.createFeature(geometry, properties);

      expect(feature).toBeInstanceOf(Feature);
      expect(feature.getGeometry()).toBe(geometry);
      expect(feature.get('name')).toBe('Test Point');
      expect(feature.getId()).toBeDefined();
    });

    test('should create a line feature', () => {
      const geometry = new LineString([
        [0, 0],
        [1, 1],
      ]);
      const feature = featureManager.createFeature(geometry);

      expect(feature.getGeometry()).toBe(geometry);
    });

    test('should create a polygon feature', () => {
      const geometry = new Polygon([
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0],
        ],
      ]);
      const feature = featureManager.createFeature(geometry);

      expect(feature.getGeometry()).toBe(geometry);
    });

    test('should handle empty properties', () => {
      const geometry = new Point([0, 0]);
      const feature = featureManager.createFeature(geometry);

      expect(feature.getProperties()).toEqual({
        geometry: geometry,
      });
    });
  });

  describe('Feature Styling', () => {
    test('should set simple style', () => {
      const feature = featureManager.createFeature(new Point([0, 0]));
      const style = new Style({
        image: new Circle({
          radius: 5,
          fill: new Fill({ color: 'red' }),
        }),
      });

      featureManager.updateFeatureStyle(feature, style);
      expect(feature.getStyle()).toBe(style);
    });

    test('should set array of styles', () => {
      const feature = featureManager.createFeature(new Point([0, 0]));
      const styles = [
        new Style({
          image: new Circle({
            radius: 10,
            fill: new Fill({ color: 'rgba(255,0,0,0.1)' }),
          }),
        }),
        new Style({
          image: new Circle({
            radius: 5,
            fill: new Fill({ color: 'red' }),
          }),
        }),
      ];

      featureManager.updateFeatureStyle(feature, styles);
      expect(feature.getStyle()).toEqual(styles);
    });

    test('should set style function', () => {
      const feature = featureManager.createFeature(new Point([0, 0]));
      const styleFunction = (feat: Feature, resolution: number) => {
        // Change radius based on resolution
        const radius = resolution > 100 ? 10 : 5;

        // Change color based on feature property
        const color = feat.get('name') ? 'blue' : 'red';

        return new Style({
          image: new Circle({
            radius,
            fill: new Fill({ color }),
          }),
        });
      };

      //@ts-expect-error - just a type-casting error
      featureManager.updateFeatureStyle(feature, styleFunction);

      expect(feature.getStyle()).toBe(styleFunction);
    });
  });

  describe('Feature Visibility', () => {
    test('should hide feature', () => {
      const feature = featureManager.createFeature(new Point([0, 0]));
      const style = new Style({
        image: new Circle({
          radius: 5,
          fill: new Fill({ color: 'red' }),
        }),
      });
      feature.setStyle(style);

      featureManager.setFeatureVisibility(feature, false);
      expect(feature.getStyle()).toBeUndefined();
    });

    test('should show feature and restore original style', () => {
      const feature = featureManager.createFeature(new Point([0, 0]));
      const originalStyle = new Style({
        image: new Circle({
          radius: 5,
          fill: new Fill({ color: 'red' }),
        }),
      });

      feature.setStyle(originalStyle);
      featureManager.setFeatureVisibility(feature, false);
      featureManager.setFeatureVisibility(feature, true);

      expect(feature.getStyle()).toBe(originalStyle);
    });
  });

  describe('Feature Properties', () => {
    test('should update feature properties', () => {
      const feature = featureManager.createFeature(new Point([0, 0]), { name: 'Original' });

      featureManager.updateFeatureProperties(feature, {
        name: 'Updated',
        description: 'New description',
      });

      expect(feature.get('name')).toBe('Updated');
      expect(feature.get('description')).toBe('New description');
    });

    test('should keep existing properties when updating', () => {
      const feature = featureManager.createFeature(new Point([0, 0]), {
        name: 'Test',
        type: 'Point',
      });

      featureManager.updateFeatureProperties(feature, {
        description: 'New description',
      });

      expect(feature.get('name')).toBe('Test');
      expect(feature.get('type')).toBe('Point');
      expect(feature.get('description')).toBe('New description');
    });
  });

  describe('Feature Registry', () => {
    test('should get feature by id', () => {
      const feature = featureManager.createFeature(new Point([0, 0]));
      const id = feature.getId();

      expect(featureManager.getFeature(id as string)).toBe(feature);
    });

    test('should remove feature', () => {
      const feature = featureManager.createFeature(new Point([0, 0]));
      const id = feature.getId() as string;

      featureManager.removeFeature(id);
      expect(featureManager.getFeature(id)).toBeUndefined();
    });

    test('should get all features', () => {
      featureManager.createFeature(new Point([0, 0]));
      featureManager.createFeature(new Point([1, 1]));
      featureManager.createFeature(new Point([2, 2]));

      expect(featureManager.getAllFeatures()).toHaveLength(3);
    });

    test('should clear all features', () => {
      featureManager.createFeature(new Point([0, 0]));
      featureManager.createFeature(new Point([1, 1]));

      featureManager.clear();
      expect(featureManager.getAllFeatures()).toHaveLength(0);
    });
  });
});
