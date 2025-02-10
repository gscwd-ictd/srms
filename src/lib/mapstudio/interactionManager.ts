import { Map } from "ol";
import Feature from "ol/Feature";
import { Draw, Interaction, Modify, Select } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

export class InteractionManager {
  private interactions: Record<string, Interaction>;
  private map: Map | null;
  private drawingLayer: VectorLayer<VectorSource>;
  private drawingSource: VectorSource;
  private selectInteraction: Select | null;

  constructor() {
    this.interactions = {};
    this.map = null;
    this.selectInteraction = null;
    this.drawingSource = new VectorSource();
    this.drawingLayer = new VectorLayer({
      source: this.drawingSource,
    });
  }

  private addInteraction(id: string, interaction: Interaction): void {
    if (this.interactions[id]) {
      throw new Error(`Interaction with id ${id} already exists`);
    }

    this.interactions[id] = interaction;

    if (this.map) {
      this.map.addInteraction(interaction);
    }
  }

  private removeInteraction(id: string): void {
    const interaction = this.interactions[id];

    if (!interaction) return;

    if (this.map) {
      this.map.removeInteraction(interaction);
    }

    delete this.interactions[id];
  }

  public setMap(map: Map) {
    this.map = map;
    this.map.addLayer(this.drawingLayer);

    // Add all existing interactions to the new map
    Object.values(this.interactions).forEach((interaction) => {
      this.map?.addInteraction(interaction);
    });
  }

  public enableDrawing(type: "Point" | "LineString" | "Polygon") {
    // Disable any existing drawing interaction
    this.disableDrawing();

    const drawInteraction = new Draw({
      source: this.drawingSource,
      type: type,
    });

    this.addInteraction("draw", drawInteraction);
  }

  public disableDrawing() {
    this.removeInteraction("draw");
  }

  public enableModify(layerId: string) {
    // Disable any existing modify interaction
    this.removeInteraction("modify");

    const targetLayer = this.map
      ?.getLayers()
      .getArray()
      .find((layer) => layer.get("id") === layerId) as VectorLayer<VectorSource>;

    if (!targetLayer) {
      throw new Error(`Layer with id ${layerId} not found`);
    }

    const modifyInteraction = new Modify({
      source: targetLayer.getSource() as VectorSource,
    });

    this.addInteraction("modify", modifyInteraction);
  }

  public enableSelect() {
    if (this.selectInteraction) {
      return; // Select interaction already enabled
    }

    this.selectInteraction = new Select();
    this.addInteraction("select", this.selectInteraction);
  }

  public disableSelect(): void {
    if (this.selectInteraction) {
      this.removeInteraction("select");
      this.selectInteraction = null;
    }
  }

  public getSelectedFeatures(): Feature[] {
    if (!this.selectInteraction) {
      return [];
    }
    return this.selectInteraction.getFeatures().getArray();
  }

  public getDrawingSource(): VectorSource {
    return this.drawingSource;
  }

  public getDrawingLayer(): VectorLayer<VectorSource> {
    return this.drawingLayer;
  }

  clear(): void {
    if (this.map) {
      Object.values(this.interactions).forEach((interaction) => {
        this.map?.removeInteraction(interaction);
      });
    }

    this.interactions = {};
    this.selectInteraction = null;
    this.drawingSource.clear();
  }

  public hasInteraction(id: string): boolean {
    return id in this.interactions;
  }

  public getInteractionIds(): string[] {
    return Object.keys(this.interactions);
  }
}
