import { PumpingStationError } from "./PumpingStationError";

export class PumpingStationDoesNotExistError extends PumpingStationError {
  constructor(description: string) {
    super("pumpingstation_does_not_exist", description, 400);
    this.name = this.constructor.name;
  }
}
