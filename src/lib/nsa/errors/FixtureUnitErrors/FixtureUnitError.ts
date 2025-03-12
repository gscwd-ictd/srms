import { FixtureUnitErrorCode, FixtureUnitErrorResponse } from "./codes";

export class FixtureUnitError extends Error {
  constructor(
    public readonly code: FixtureUnitErrorCode, // make sure to type the code properly
    public readonly description: string, // make this optional or not, up to you. it all depends on your implementation
    public readonly status: number = 400, // make status code 400 as the default, but of course it still depends on your implementation
    // add more fields here, as you see fit (i.e. message, state, etc.)
  ) {
    // override the super class and use your custom implementation instead.
    // in this case, if description is not provided (since description is just optional), use code as a fallback.
    super(description || code);
    // add a custom name for your error
    this.name = "MinioError";
  }

  toJSON(): FixtureUnitErrorResponse {
    return {
      code: this.code,
      status: this.status,
      description: this.description,
    };
  }
}
