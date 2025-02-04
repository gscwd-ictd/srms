export class HTTPError extends Error {
  status: number;
  message: string;
  description?: string;

  constructor(status: number, message: string, name: string = "HTTPError") {
    super(message);
    this.name = name; // Set name after super()
    this.status = status;
    this.message = message;
    Error.captureStackTrace(this, HTTPError);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      stack: this.stack,
    };
  }
}
