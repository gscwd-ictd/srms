export interface I_MinIO {
  uploadFileBuffer(formData: FormData): Promise<object>;
  uploadFileBuffers(formData: FormData): object;
  uploadFile(sourceFile: string, destinationObject: string): Promise<object>;
  uploadFiles(files: string[]): Promise<object>;
  getFile(fileName: string, folderName?: string): Promise<object>;
}
