import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { Map, View } from 'ol';
import { Control } from 'ol/control';
import { ControlManager } from '../controlManager';

describe('ControlManager', () => {
  let controlManager: ControlManager;
  let map: Map;
  let target: HTMLDivElement;

  beforeEach(() => {
    // Create a target element for the map
    target = document.createElement('div');
    target.style.width = '100px';
    target.style.height = '100px';
    document.body.appendChild(target);

    map = new Map({
      target,
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    controlManager = new ControlManager();
    controlManager.setMap(map);
  });

  afterEach(() => {
    map.setTarget(undefined);
    target.remove();
  });

  describe('Basic Control Operations', () => {
    test('should add control successfully', () => {
      const customControl = new Control({
        element: document.createElement('div'),
      });

      controlManager.addControl('custom', customControl);
      expect(controlManager.getControl('custom')).toBe(customControl);
      expect(controlManager.hasControl('custom')).toBe(true);
    });

    test('should throw error when adding duplicate control ID', () => {
      const control1 = new Control({
        element: document.createElement('div'),
      });
      const control2 = new Control({
        element: document.createElement('div'),
      });

      controlManager.addControl('test', control1);
      expect(() => {
        controlManager.addControl('test', control2);
      }).toThrowError('Control with id test already exists');
    });

    test('should remove control successfully', () => {
      const control = new Control({
        element: document.createElement('div'),
      });

      controlManager.addControl('test', control);
      controlManager.removeControl('test');

      expect(controlManager.getControl('test')).toBeUndefined();
      expect(controlManager.hasControl('test')).toBe(false);
    });

    test('should handle removing non-existent control', () => {
      expect(() => {
        controlManager.removeControl('nonexistent');
      }).not.toThrow();
    });
  });

  describe('Map Integration', () => {
    test('should add controls to map when setting map', () => {
      const control = new Control({
        element: document.createElement('div'),
      });

      // Add control before setting map
      const newControlManager = new ControlManager();
      newControlManager.addControl('test', control);

      // Set map and verify control is added
      newControlManager.setMap(map);
      expect(map.getControls().getArray()).toContain(control);
    });

    test('should remove controls from map when clearing', () => {
      const control = new Control({
        element: document.createElement('div'),
      });

      controlManager.addControl('test', control);
      expect(map.getControls().getArray()).toContain(control);

      controlManager.clear();
      expect(map.getControls().getArray()).not.toContain(control);
      expect(controlManager.getControlIds()).toHaveLength(0);
    });
  });

  describe('Control Updates', () => {
    test('should update control properties', () => {
      // Create a custom control with a property we can verify
      class CustomControl extends Control {
        private customProperty: string;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(options: any) {
          super({
            element: document.createElement('div'),
          });
          this.customProperty = options.customProperty || '';
        }

        getCustomProperty(): string {
          return this.customProperty;
        }
      }

      const control = new CustomControl({
        customProperty: 'initial',
      });

      controlManager.addControl('test', control);

      // Update the custom property
      controlManager.updateControl('test', { customProperty: 'updated' });

      const updatedControl = controlManager.getControl('test') as CustomControl;
      expect(updatedControl.getCustomProperty()).toBe('updated');
    });

    test('should handle updating non-existent control', () => {
      expect(() => {
        controlManager.updateControl('nonexistent', { target: document.createElement('div') });
      }).not.toThrow();
    });
  });
});
