# Creating a custom Library

First, create a directory inside `/lib` for your custom library.

### `lib/myblib`

Then add the neccessary folders for your library. It would normally contain these folders: `/interfaces`, `/services`, `/repositories`, `/errors`. (But still subject for implementation)

1. ### Interfaces (Contracts and Abstractions)

- Defines contracts for services, repositories, or other components.
- Ensures that implementations follow a consistent structure.

```typescript
export interface I_UserRepository {
  findUserById(userId: string): Promise<User>;
  findAllUsers(): Promise<User[]>;
  addNew(user: User): Promise<User>;
}

export interface I_UserService {
  createSchedule(userId: string): Promise<UserSchedule>;
}
```

2. ### Repositories (Database Access Layer)

- Handles data persistence and retrieval.
- Interacts directly with the database.

```typescript
export class UserRepository implements I_UserRepository {
  async findUserById(userId: string) {
    const res = await db.select().from(users).where(eq(users.id, userId));
    return res[0];
  }

  async findAllUsers() {
    return await db.select().from(users);
  }

  async addNew(user: User) {
    const res = await db.insert(users).values(user).returning();
    return res[0];
  }
}
```

3. ### Services (Business Logic and Use Cases)

- Contains the core business logic of the application.
- Acts as an intermediary between repository (database layer) and controller (API endpoint).
- Typically, services would fetch, process, and return the data.

```typescript
export class UserService implements I_UserService {
  // Notice that the type of userRepository is I_UserRepository (interface), and not the UserRepository (concrete implementation)
  // This is the advantage of this particular architecture, since you don't need to have a concrete implementation of classes
  // to test the functionality of your code, thus, making it loosely coupled and consequently, making it more testable
  constructor(private readonly userRepository: I_UserRepository) {}

  async createSchedule(userId: string) {
    const user = await this.userRepository.findUserById(userId);

    if (
      !user.hasSchedule({
        dateFrom: "2025-01-01",
        dateTo: "2025-01-15",
        timeFrom: "08:00AM",
        timeTo: "05:00PM",
      })
    ) {
      return await createUserScheduleForSomeUser(user);
    }
  }
}
```

## Create a Singleton class

Then to tie them all together, you can just simply create a singleton class.
`/lib/myLib/MyLibManager`

```typescript
class MyLibManager {
  private static instance: MyLibManager;
  private static _userService: UserService;
  private static _userRepository: I_UserRepository;

  private static init() {
    if (!this.instance) {
      this.instance = new MyLibManager();
      this._userService = new UserService();
      this._userRepository = new UserRepository();
    }
    return this.instance;
  }

  public static getInstance(): MyLibManager {
    return this.init();
  }

  get userRepository(): I_UserRepository {
    return this._userRepository;
  }

  get userService(): UserService {
    return this._userService;
  }
}
```

## Usage

Initialize the main entry point of your library. Note that by now, you should have a concrete implementation of your interfaces.

```typescript
export const myLibManager = MyLibrManager.getInstance();
```

Then in your `controller` or `handler`:

```typescript
const honoApp.post("/users/schedules", async (c) => {
    const schedule = await myLibManager.userService.createSchedule(userId);
    return c.json(schedule, 200)
})
```

# Creating a custom error for your library

First, create your custom error codes (add more codes as you discover more possible errors along the way)

### `/lib/myLib/errors/codes`

```typescript
export type MyCustomErrorCode = "invalid_request" | "unauthorized";

// then let's create a custom type for out ErrorResponse
export type MyCustomErrorResponse = {
  code: MyCustomErrorCode;
  description?: string;
  status: number;
};
```

Then, create the base class for your custom error that extends `Error`

### `/lib/myLib/errors/MyCustomError`

```typescript
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

```typescript
export class InvalidRequestError extends MyCustomError {
  // pass in the desription field
  constructor(description?: string) {
    // override the parent class (MyCustomError), and set the code to "invalid_request", and description.
    super("invalid_request", description);

    // make sure to override the default name as well, to match the actual nature of this error.
    this.name = "InvalidRequestError";
  }
}
```

Then let's use the `InvalidRequestError`

```typescript
try {
  if (something_goes_wrong) {
    throw new InvalidRequestError("The request is malformed.");
  }
} catch (error) {
  // in most cases, you don't need this, since hono already serializes error into JSON format.
  // but for the sake of extensibility, it's always good to have this.
  if (error instanceof MyCustomError) {
    console.log(error.toJSON());
  }
}
```
