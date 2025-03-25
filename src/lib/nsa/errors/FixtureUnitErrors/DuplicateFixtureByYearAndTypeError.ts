import { FixtureUnitError } from "./FixtureUnitError";

export class DuplicateFixtureByYearAndTypeError extends FixtureUnitError {
  constructor(description: string) {
    super("duplicate_fixture_by_year_and_type", description, 409);
    this.name = this.constructor.name;
  }
}
