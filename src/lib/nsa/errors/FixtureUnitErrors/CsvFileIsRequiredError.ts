import { FixtureUnitError } from "./FixtureUnitError";

export class CsvFileIsRequiredError extends FixtureUnitError {
  constructor(description: string) {
    super("csv_file_is_required", description, 400);
    this.name = this.constructor.name;
  }
}
