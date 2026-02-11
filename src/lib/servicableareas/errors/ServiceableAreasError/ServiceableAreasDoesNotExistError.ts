import { ServiceableAreasError } from "./ServiceableAreasError";

export class ServiceableAreasDoesNotExistError extends ServiceableAreasError {
  constructor(description: string) {
    super("serviceable_area_does_not_exist", description, 400);
    this.name = this.constructor.name;
  }
}
