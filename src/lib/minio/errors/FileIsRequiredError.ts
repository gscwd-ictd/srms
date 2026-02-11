import { MinioError } from "./MinioError";

export class FileIsRequiredError extends MinioError {
    constructor(description: string) {
        super('file_is_required', description, 400);
        this.name = this.constructor.name;
    }
}