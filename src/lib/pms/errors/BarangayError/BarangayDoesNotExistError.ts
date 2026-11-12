import { BarangayError } from "./BarangayError";

export class BarangayDoesNotExistError extends BarangayError {
  constructor(description: string) {
    super("barangay_does_not_exist", description, 400);
    this.name = this.constructor.name;
  }
}
