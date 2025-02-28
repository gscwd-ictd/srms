import { I_MinIO } from "../interfaces/IMinIO";

export class MinIoService implements I_MinIO {
  constructor(
    private readonly bucket: string,
    private readonly client: object,
  ) {}

  async uploadFileBuffer(formData: FormData): Promise<object> {
    throw new Error("Method not implemented.");
  }

  uploadFileBuffers(formData: FormData): object {
    throw new Error("Method not implemented.");
  }

  uploadFile(sourceFile: string, destinationObject: string): Promise<object> {
    throw new Error("Method not implemented.");
  }

  uploadFiles(files: string[]): Promise<object> {
    throw new Error("Method not implemented.");
  }

  getFile(fileName: string, folderName?: string): Promise<object> {
    throw new Error("Method not implemented.");
  }
}
