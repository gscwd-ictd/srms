import { TrackSolidError } from "./TrackSolidError";

export class NonexistentAccountError extends TrackSolidError {
  // pass in the description field
  constructor(description?: string) {
    // override the parent class (MyCustomError), and set the code to "invalid_request", and description.
    super("nonexistent_account", description);

    // make sure to override the default name as well, to match the actual nature of this error.
    this.name = this.constructor.name;
  }
}
