import { FixtureUnitError } from "./FixtureUnitError";

export class FixtureUnitDoesNotExistsError extends FixtureUnitError {
  constructor(description: string) {
    super("fixture_unit_does_not_exists", description, 404);
    this.name = this.constructor.name;
  }
}
