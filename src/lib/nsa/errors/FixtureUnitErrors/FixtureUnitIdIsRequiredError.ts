import { FixtureUnitError } from "./FixtureUnitError";

export class FixtureUnitIdIsRequiredError extends FixtureUnitError {
  constructor(description: string) {
    super("fixture_unit_id_is_required", description, 409);
    this.name = this.constructor.name;
  }
}
