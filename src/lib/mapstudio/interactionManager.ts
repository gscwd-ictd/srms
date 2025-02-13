import { Map } from "ol";
import { Coordinate } from "ol/coordinate";
import Feature from "ol/Feature";
import { LineString, Point, Polygon } from "ol/geom";
import { Draw, Interaction, Modify, Select, Snap } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style } from "ol/style";

type SnapConfig = {
  pixel?: number; // Pixel tolerance for snapping
  edge?: boolean; // Enable edge snapping
  vertex?: boolean; // Enable vertex snapping
  source?: VectorSource; // Optional specific source to snap to
};

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

  public enableDrawing(
    type: "Point" | "LineString" | "Polygon",
    freehand?: boolean,
    drawStyle?: Style,
    snapConfig?: SnapConfig | boolean,
    onComplete?: (coordinates: Coordinate[] | undefined) => void,
  ) {
    // Disable any existing drawing interaction
    this.disableDrawing();

    const drawInteraction = new Draw({
      source: this.drawingSource,
      type: type,
      style: drawStyle,
      freehand: freehand,
    });

    // Add draw interaction first
    this.addInteraction("draw", drawInteraction);

    drawInteraction.on("drawstart", () => {
      document.body.classList.add("cursor-crosshair");
    });

    // Then handle snapping
    if (snapConfig) {
      let snapOptions: Partial<SnapConfig> = {};

      if (typeof snapConfig === "boolean") {
        snapOptions = {
          pixel: 10,
          edge: true,
          vertex: true,
          source: this.drawingSource,
        };
      } else {
        snapOptions = {
          pixel: snapConfig.pixel ?? 10,
          edge: snapConfig.edge ?? true,
          vertex: snapConfig.vertex ?? true,
          source: snapConfig.source ?? this.drawingSource,
        };
      }

      const snapInteraction = new Snap({
        source: snapOptions.source,
        pixelTolerance: snapOptions.pixel,
        edge: snapOptions.edge,
        vertex: snapOptions.vertex,
      });

      // Add snap interaction after draw interaction
      this.addInteraction("snap", snapInteraction);
    }

    drawInteraction.on("drawend", (e) => {
      const feature = e.feature;
      feature.setStyle(drawStyle);
      document.body.classList.add("cursor-default");
    });

    if (onComplete) {
      drawInteraction.on("drawend", (event) => {
        const feature = event.feature;

        const geometry = feature.getGeometry();

        // Check if draw mode is Point
        if (geometry instanceof Point) {
          const coordinate = geometry.getCoordinates();
          onComplete([coordinate]);

          // Check if draw mode is LineString
        } else if (geometry instanceof LineString) {
          const coordinates = geometry.getCoordinates();
          onComplete(coordinates);

          // Check if draw mode is Polygon
        } else if (geometry instanceof Polygon) {
          const coordinates = geometry.getCoordinates()[0];
          onComplete(coordinates);

          // Automatically disable drawing if Polygon is complete
          this.disableDrawing();
        }
      });
    }
  }

  public disableDrawing() {
    this.removeInteraction("draw");
    this.removeInteraction("snap");
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
