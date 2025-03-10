import { UploadedFile, UploadedObjectInfo } from "../types";

export interface I_MinioManager {
  uploadFileBuffer(formData: FormData): Promise<UploadedObjectInfo | undefined>;
  uploadFileBuffers(formData: FormData): Promise<(string | undefined)[] | undefined>;
  uploadFile(sourceFile: string, destinationObject: string): Promise<UploadedObjectInfo | undefined>;
  uploadFiles(files: UploadedFile[]): Promise<UploadedObjectInfo[] | undefined>;
  getFile(fileName: string, folderName?: string): Promise<string | undefined>;
  getFilesByFolder(folderName: string): Promise<{ name: string; url: string | undefined }[]>;
  getFileMimeType(fileName: string): Promise<string>;
  deleteFile(fileName: string, folderName?: string): Promise<boolean>;
  deleteFiles(folderName: string): Promise<string[]>;
}
