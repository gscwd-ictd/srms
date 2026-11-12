import { HydrantError } from "./HydrantError";

export class HydrantDoesNotExistError extends HydrantError {
  constructor(description: string) {
    super("hydrant_does_not_exist", description, 400);
    this.name = this.constructor.name;
  }
}
