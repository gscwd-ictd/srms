export class HTTPError extends Error {
  status: number;
  message: string;
  description?: string;
  details?: Record<string, any>;

  constructor(status: number, message: string, name: string = "HTTPError", details?: Record<string, any>) {
    super(message);
    this.name = name; // Set name after super()
    this.status = status;
    this.message = message;
    this.details = details;

    Error.captureStackTrace(this, HTTPError);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details,
      stack: this.stack,
    };
  }
}
