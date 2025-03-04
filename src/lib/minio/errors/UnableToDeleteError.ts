import { MinioError } from "./MinioError";

export class UnableToDeleteError extends MinioError {
    constructor(description: string) {
        super('unable_to_delete', description, 500);
        this.name = this.constructor.name;
    }
}