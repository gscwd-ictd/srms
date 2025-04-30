import { TrackSolidError } from "./TrackSolidError";

export class NonExistentDeviceError extends TrackSolidError {
  // pass in the description field
  constructor(description?: string) {
    // override the parent class (MyCustomError), and set the code to "invalid_request", and description.
    super("nonexistent_device", description);

    // make sure to override the default name as well, to match the actual nature of this error.
    this.name = this.constructor.name;
  }
}
