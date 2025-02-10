import { Map } from "ol";
import Control from "ol/control/Control";

export class ControlManager {
  private controls: Record<string, Control>;
  private map: Map | null;

  constructor() {
    this.controls = {};
    this.map = null;
  }

  public setMap(map: Map) {
    this.map = map;

    // Add all existing controls to the new map
    Object.values(this.controls).forEach((control) => {
      this.map?.addControl(control);
    });
  }

  public addControl(id: string, control: Control) {
    if (this.controls[id]) {
      throw new Error(`Control with id ${id} already exists`);
    }

    this.controls[id] = control;

    if (this.map) {
      this.map.addControl(control);
    }
  }

  public removeControl(id: string) {
    const control = this.controls[id];
    if (!control) return;

    if (this.map) {
      this.map.removeControl(control);
    }

    delete this.controls[id];
  }

  public getControl(id: string) {
    return this.controls[id];
  }

  public clear(): void {
    if (this.map) {
      Object.values(this.controls).forEach((control) => {
        this.map?.removeControl(control);
      });
    }

    this.controls = {};
  }

  public getControlIds(): string[] {
    return Object.keys(this.controls);
  }

  public hasControl(id: string): boolean {
    return id in this.controls;
  }

  public updateControl(id: string, options: Record<string, unknown>): void {
    const control = this.controls[id];

    if (!control) return;

    // Remove existing control
    if (this.map) {
      this.map.removeControl(control);
    }

    // Apply new options
    Object.assign(control, options);

    // Re-add the control
    if (this.map) {
      this.map.addControl(control);
    }
  }
}
