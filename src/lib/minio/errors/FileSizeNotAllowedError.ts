import { MinioError } from "./MinioError";

export class FileSizeNotAllowedError extends MinioError {
    constructor(description: string) {
        super('file_size_not_allowed', description, 403);
        this.name = this.constructor.name;
    }
}