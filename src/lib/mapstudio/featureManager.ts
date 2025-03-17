import { generateCuid } from '../../server/helpers/generateCuid';
import Feature from 'ol/Feature';
import { Geometry } from 'ol/geom';
import Style, { StyleFunction } from 'ol/style/Style';

export type FeatureProperties = {
  id?: string | number;
  name?: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow any additional properties
};

export class FeatureManager {
  private features: Record<string, Feature>;

  constructor() {
    this.features = {};
  }

  /**
   *
   * @param geometry
   * @param properties
   * @returns
   *
   * @example
   *
   * Example usage:
   *
   * const feature = featureManager.createFeature(
   *   new Point([0, 0]),
   *   {
   *     id: '123',
   *     name: 'My Point',
   *     description: 'A point of interest',
   *     customField: 'some value'  // This is also allowed
   *   }
   * );
   *
   */
  public createFeature(geometry: Geometry, properties: FeatureProperties = {}): Feature {
    const feature = new Feature();
    feature.setGeometry(geometry);
    feature.setProperties(properties);

    // Generate a unique ID if not provided
    const id = properties.id || generateCuid();
    feature.setId(id);
    this.features[id] = feature;

    return feature;
  }

  public updateFeatureStyle(feature: Feature, style: Style | Style[] | StyleFunction): void {
    feature.setStyle(style);
  }

  public updateFeatureProperties(feature: Feature, properties: object): void {
    // Merge new properties with existing ones
    const existingProperties = feature.getProperties();
    const updatedProperties = {
      ...existingProperties,
      ...properties,
    };

    // Remove geometry from properties as it's handled separately
    delete updatedProperties.geometry;

    // Update all properties
    feature.setProperties(updatedProperties);
  }

  public getFeature(id: string): Feature | undefined {
    return this.features[id];
  }

  public removeFeature(id: string): void {
    delete this.features[id];
  }

  public getAllFeatures(): Feature[] {
    return Object.values(this.features);
  }

  public clear(): void {
    this.features = {};
  }

  // Helper methods for common feature operations
  setFeatureVisibility(feature: Feature, visible: boolean): void {
    if (!visible) {
      // Store current style before hiding
      const currentStyle = feature.getStyle();

      if (currentStyle) {
        feature.set('originalStyle', currentStyle);
      }

      // Hide feature
      feature.setStyle(undefined);
    } else {
      // Restore original style if it exists
      const originalStyle = feature.get('originalStyle');

      if (originalStyle) {
        feature.setStyle(originalStyle);
        feature.unset('originalStyle'); // Clean up stored style
      }
    }
  }

  public cloneFeature(feature: Feature): Feature {
    const clone = feature.clone();

    const id = generateCuid();

    clone.setId(id);

    this.features[id] = clone;

    return clone;
  }

  public moveFeature(feature: Feature, deltaX: number, deltaY: number): void {
    const geometry = feature.getGeometry();
    if (geometry) {
      geometry.translate(deltaX, deltaY);
    }
  }

  // Helper method to get feature properties without geometry
  public getFeatureProperties(feature: Feature): Record<string, unknown> {
    const properties = feature.getProperties();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { geometry, ...rest } = properties;

    return rest;
  }
}
