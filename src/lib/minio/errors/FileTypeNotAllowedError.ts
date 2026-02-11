import { MinioError } from "./MinioError";

export class FileTypeNotAllowedError extends MinioError {
  constructor(description: string) {
    super("file_type_not_allowed", description, 415);
    this.name = this.constructor.name;
  }
}
