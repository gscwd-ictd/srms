import { WaterMetersError } from "./WaterMetersError";

export class WaterMetersDoesNotExistError extends WaterMetersError {
  constructor(description: string) {
    super("water_meters_does_not_exist", description, 400);
    this.name = this.constructor.name;
  }
}
