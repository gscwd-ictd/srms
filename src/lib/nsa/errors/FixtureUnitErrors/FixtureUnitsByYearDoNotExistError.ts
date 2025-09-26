import { FixtureUnitError } from "./FixtureUnitError";

export class FixtureUnitsByYearDoNotExistError extends FixtureUnitError {
  constructor(description: string) {
    super("fixture_units_by_year_do_not_exist", description, 404);
    this.name = this.constructor.name;
  }
}
