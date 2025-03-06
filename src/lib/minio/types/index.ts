export type UploadedFile = {
  //id: string;
  /**
   * @description Full File Name (may include directory)
   */
  name: string;

  /**
   * @description Full Source Path of the file
   */
  source: string;
  //url: string;
};

export type UploadedObjectInfo = {
  etag: string;
  versionId: string | null;
};

export type MinioManagerUploadOptions = {
  maximumAllowedFileSize?: number;
  allowedFileTypes?: string[];
};
