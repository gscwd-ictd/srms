import Collection from "ol/Collection";
import LayerGroup from "ol/layer/Group";
import Layer from "ol/layer/Layer";
import Map from "ol/Map";

export class LayerManager {
  private layers: Record<string, Layer>;
  private layerGroups: Record<string, LayerGroup>;
  private map: Map | null;

  constructor() {
    this.layers = {};
    this.layerGroups = {};
    this.map = null;
  }

  public setMap(map: Map) {
    this.map = map;

    // Add all existing layers to the new map
    Object.values(this.layers).forEach((layer) => {
      this.map?.addLayer(layer);
    });

    // Add all existing layer groups to the new map
    Object.values(this.layerGroups).forEach((group) => {
      this.map?.addLayer(group);
    });
  }

  public addLayer(id: string, layer: Layer, groupId?: string) {
    if (this.layers[id]) {
      throw new Error(`Layer with id ${id} already exists!`);
    }

    this.layers[id] = layer;

    if (groupId && this.layerGroups[groupId]) {
      const group = this.layerGroups[groupId];
      group.getLayers().push(layer);
    } else if (this.map) {
      this.map.addLayer(layer);
    }
  }

  public removeLayer(id: string) {
    const layer = this.layers[id];

    if (!layer) return;

    if (this.map) {
      this.map.removeLayer(layer);
    }

    Object.values(this.layerGroups).forEach((group) => {
      const layers = group.getLayers();
      if (layers instanceof Collection) {
        const index = layers.getArray().indexOf(layer);
        if (index !== -1) {
          layers.removeAt(index);
        }
      }
    });

    delete this.layers[id];
  }

  public getLayer(id: string): Layer | undefined {
    return this.layers[id];
  }

  public setLayerVisibility(id: string, visible: boolean) {
    const layer = this.layers[id];

    if (layer) {
      layer.setVisible(visible);
    }
  }

  public setLayerOpacity(id: string, opacity: number) {
    const layer = this.layers[id];

    if (layer) {
      layer.setOpacity(Math.max(0, Math.min(1, opacity)));
    }
  }

  public createLayerGroup(groupId: string, layers?: Layer[]): LayerGroup {
    if (this.layerGroups[groupId]) {
      throw new Error(`Layer group with id ${groupId} already exists`);
    }

    const group = new LayerGroup({
      layers: layers || [],
    });

    this.layerGroups[groupId] = group;

    if (this.map) {
      this.map.addLayer(group);
    }

    return group;
  }

  public removeLayerGroup(groupId: string): void {
    const group = this.layerGroups[groupId];
    if (!group) return;

    if (this.map) {
      this.map.removeLayer(group);
    }

    delete this.layerGroups[groupId];
  }

  public getLayerGroup(groupId: string): LayerGroup | undefined {
    const group = this.layerGroups[groupId];
    if (!group) return;

    if (this.map) {
      return group;
    }
  }

  public setLayerIndex(id: string, index: number): void {
    const layer = this.layers[id];
    if (!layer || !this.map) return;

    const layerCollection = this.map.getLayers();
    const currentIndex = layerCollection.getArray().indexOf(layer);

    if (currentIndex !== -1) {
      layerCollection.removeAt(currentIndex);
      layerCollection.insertAt(index, layer);
    }
  }

  public getLayerPosition(id: string): number {
    const layer = this.layers[id];
    if (!layer || !this.map) return -1;

    return this.map.getLayers().getArray().indexOf(layer);
  }

  public clear(): void {
    if (this.map) {
      Object.values(this.layers).forEach((layer) => {
        this.map?.removeLayer(layer);
      });

      Object.values(this.layerGroups).forEach((group) => {
        this.map?.removeLayer(group);
      });
    }

    this.layers = {};
    this.layerGroups = {};
  }

  // Helper method to move layer up in the stack
  public moveLayerUp(id: string): boolean {
    const currentIndex = this.getLayerPosition(id);
    if (currentIndex === -1 || !this.map) return false;

    const maxIndex = this.map.getLayers().getLength() - 1;
    if (currentIndex < maxIndex) {
      this.setLayerIndex(id, currentIndex + 1);
      return true;
    }
    return false;
  }

  // Helper method to move layer down in the stack
  public moveLayerDown(id: string): boolean {
    const currentIndex = this.getLayerPosition(id);
    if (currentIndex <= 0) return false;

    this.setLayerIndex(id, currentIndex - 1);
    return true;
  }

  // Get all layer IDs
  public getLayerIds(): string[] {
    return Object.keys(this.layers);
  }

  // Get all group IDs
  public getGroupIds(): string[] {
    return Object.keys(this.layerGroups);
  }
}
