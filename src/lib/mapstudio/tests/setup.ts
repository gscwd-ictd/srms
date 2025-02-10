import { beforeAll } from "vitest";

beforeAll(() => {
  // Mock browser APIs that OpenLayers uses
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});
