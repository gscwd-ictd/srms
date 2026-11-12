import { TrackSolidError } from "./TrackSolidError";

export class IncorrectCredentialsError extends TrackSolidError {
  // pass in the description field
  constructor(description?: string) {
    // override the parent class (MyCustomError), and set the code to "invalid_request", and description.
    super("incorrect_credentials", description);

    // make sure to override the default name as well, to match the actual nature of this error.
    this.name = this.constructor.name;
  }
}
