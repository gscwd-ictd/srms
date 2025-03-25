import { FixtureUnitError } from "./FixtureUnitError";

export class FixtureDoesNotExistError extends FixtureUnitError {
  constructor(description: string) {
    super("fixture_does_not_exist", description, 404);
    this.name = this.constructor.name;
  }
}
