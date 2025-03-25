import { FixtureUnitError } from "./FixtureUnitError";

export class FileTypeNotAllowedError extends FixtureUnitError {
  constructor(description: string) {
    super("file_type_not_allowed", description, 415);
    this.name = this.constructor.name;
  }
}
