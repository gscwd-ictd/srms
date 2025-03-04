import { MinioError } from "./MinioError";

export class UnableToUploadError extends MinioError {
    constructor(description: string) {
        super('unable_to_upload', description, 500);
        this.name = this.constructor.name;
    }
}