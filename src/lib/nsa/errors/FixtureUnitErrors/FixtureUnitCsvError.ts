import { FixtureUnitError } from "./FixtureUnitError";

export class FixtureUnitCsvError extends FixtureUnitError {
  constructor(description: string) {
    super("fixture_unit_csv_error", description, 400);
    this.name = this.constructor.name;
  }
}
