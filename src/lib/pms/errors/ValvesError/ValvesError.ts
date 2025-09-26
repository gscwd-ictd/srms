import { ValvesErrorCode, ValvesErrorResponse } from "./codes";

export class ValvesError extends Error {
  // Set the constructor of your custom error class to match `ServiceableAreasErrorReponse` type
  constructor(
    public readonly code: ValvesErrorCode, // make sure to type the code properly
    public readonly description?: string, // make this optional or not, up to you. it all depends on your implementation
    public readonly status: number = 400, // make status code 400 as the default, but of course it still depends on your implementation
    // add more fields here, as you see fit (i.e. message, state, etc.)
  ) {
    // override the super class and use your custom implementation instead.
    // in this case, if description is not provided (since description is just optional), use code as a fallback.
    super(description || code);

    // add a custom name for your error
    this.name = "ValvesError";
  }

  // create a utility method to serialize error response into a structured JSON response
  toJSON(): ValvesErrorResponse {
    const errorResponse: ValvesErrorResponse = {
      // you can automatically target code and status, since they are required fields,
      // which means, it is guaranteed that they are not undefined or null - whichever is the case
      code: this.code,
      status: this.status,
    };

    // but for the case of description, since it's an optional field (at least in this particular implementation),
    // let's check first if it exists. and if so, append it into out errorResponse object.
    if (this.description) {
      errorResponse.description = this.description;
    }

    return errorResponse;
  }
}
