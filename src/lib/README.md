# Creating a custom error for your library

First, create your custom error codes (add more codes as you discover more possible errors along the way)

### `/lib/myLib/errors/codes`

```
export type MyCustomErrorCode = "invalid_request" | "unauthorized";

// then let's create a custom type for out ErrorResponse
export type MyCustomErrorResponse = {
    code: MyCustomErrorCode
    description?: string
    status: number
}
```

Then, create the base class for your custom error that extends `Error`

### `/lib/myLib/errors/MyCustomError`

```
export class MyCustomError extends Error {
    // Set the constructor of your custom error class to match `MyCustomErrorReponse` type
    constructor(
        public readonly code: MyCustomErrorCode, // make sure to type the code properly
        public readonly description?: string, // make this optional or not, up to you. it all depends on your implementation
        public readonly status: number = 400 // make status code 400 as the default, but of course it still depends on your implementation
        // add more fields here, as you see fit (i.e. message, state, etc.)
    ) {
        // override the super class and use your custom implementation instead.
        // in this case, if description is not provided (since description is just optional), use code as a fallback.
        super(description || code)

        // add a custom name for your error
        this.name = "MyCustomError"
    }

    // create a utility method to serialize error response into a structured JSON response
    toJSON(): MyCustomErrorResponse {
        const errorResponse: MyCustomErrorResponse = {
            // you can automatically target code and status, since they are required fields,
            // which means, it is guaranteed that they are not undefined or null - whichever is the case
            code: this.code
            status: this.status
        }

        // but for the case of description, since it's an optional field (at least in this particular implementation),
        // let's check first if it exists. and if so, append it into out errorResponse object.
        if(this.description) {
            errorResponse.description = this.description
        }

        return errorResponse;
    }
}

```

Then we can create the specific errors that extend from our base class custom error.

### `/lib/myLib/errors/InvalidRequestError`

```
export class InvalidRequestError extends MyCustomError {
    // pass in the desription field
    constructor(description?: string) {
        // override the parent class (MyCustomError), and set the code to "invalid_request", and description.
        super("invalid_request", description)

        // make sure to override the default name as well, to match the actual nature of this error.
        this.name = "InvalidRequestError"
    }
}
```

Then let's use the `InvalidRequestError`

```
try {
    if(something_goes_wrong) {
        throw new InvalidRequestError("The request is malformed.")
    }
} catch (error) {

    // in most cases, you don't need this, since hono already serializes error into JSON format.
    // but for the sake of extensibility, it's always good to have this.
    if(error instanceof MyCustomError) {
        console.log(error.toJSON())
    }
}
```
