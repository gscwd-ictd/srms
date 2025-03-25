import { MinioError } from "./MinioError";

export class InvalidCredentialsError extends MinioError {
    constructor(description: string) {
        super('invalid_credentials', description, 401);
        this.name = this.constructor.name;
    }
}