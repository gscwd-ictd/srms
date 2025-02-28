import { MyCustomError } from "../MyCustomError";

export class InvalidRequestError extends MyCustomError {
  // pass in the desription field
  constructor(description?: string) {
    // override the parent class (MyCustomError), and set the code to "invalid_request", and description.
    super("invalid_request", description);

    // make sure to override the default name as well, to match the actual nature of this error.
    this.name = "InvalidRequestError";
  }
}

export class MyService {
  public async something() {
    throw new InvalidRequestError("Something went wrong!");
  }
}
