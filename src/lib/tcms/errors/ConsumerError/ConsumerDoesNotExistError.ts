import { ConsumerError } from "./ConsumerError";

export class ConsumerDoesNotExistError extends ConsumerError {
  constructor(description: string) {
    super("consumer_does_not_exist", description, 400);
    this.name = this.constructor.name;
  }
}
