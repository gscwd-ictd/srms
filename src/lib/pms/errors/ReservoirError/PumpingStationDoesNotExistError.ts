import { ReservoirError } from "./PumpingStationError";

export class ReservoirDoesNotExistError extends ReservoirError {
  constructor(description: string) {
    super("reservoir_does_not_exist", description, 400);
    this.name = this.constructor.name;
  }
}
