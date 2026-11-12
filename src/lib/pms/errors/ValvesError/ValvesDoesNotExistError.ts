import { ValvesError } from "./ValvesError";

export class ValvesDoesNotExistError extends ValvesError {
  constructor(description: string) {
    super("valves_does_not_exist", description, 400);
    this.name = this.constructor.name;
  }
}
