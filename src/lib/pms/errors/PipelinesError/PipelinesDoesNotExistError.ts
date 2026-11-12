import { PipelinesError } from "./PipelinesError";

export class PipelinesDoesNotExistError extends PipelinesError {
  constructor(description: string) {
    super("pipelines_does_not_exist", description, 400);
    this.name = this.constructor.name;
  }
}
