import { MinioError } from "./MinioError";

export class FileNotFoundError extends MinioError {
    constructor(description: string) {
        super('file_not_found', description, 404);
        this.name = this.constructor.name;
    }
}