import * as Minio from "minio";
import { MinioManagerUploadOptions, UploadedFile } from "./types";
import env from "@srms/utils/env";
import { I_MinioManager } from "./interfaces/IMinioManager";
import { FileIsRequiredError } from "./errors/FileIsRequiredError";
import { FileNotFoundError } from "./errors/FileNotFoundError";
import { UnableToDeleteError } from "./errors/UnableToDeleteError";
import { UnableToUploadError } from "./errors/UnableToUploadError";
import { FileTypeNotAllowedError } from "./errors/FileTypeNotAllowedError";
import { FileSizeNotAllowedError } from "./errors/FileSizeNotAllowedError";

export class MinioManager implements I_MinioManager {
  //#region properties
  private static instance: MinioManager | null = null;
  private bucket = env.MINIO_BUCKET;
  private minioClient: Minio.Client;

  private constructor(private readonly minioClientOptions: Minio.ClientOptions) {
    this.minioClient = new Minio.Client(minioClientOptions);
  }

  public static getInstance(minioClientOptions: Minio.ClientOptions): MinioManager {
    if (!this.instance) {
      this.instance = new MinioManager(minioClientOptions);
    }
    return this.instance;
  }
  //#endregion properties

  //#region Upload/s
  async uploadFileBuffer(formData: FormData, options?: MinioManagerUploadOptions) {
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;
    console.log(formData);

    if (options) {
      if (options.allowedFileTypes && !options.allowedFileTypes.includes(file.type)) {
        throw new FileTypeNotAllowedError("File type is not allowed");
      }
      if (options.maximumAllowedFileSize && file.size > options.maximumAllowedFileSize) {
        throw new FileSizeNotAllowedError("File Size exceeds the maximum allowed value.");
      }
    }

    if (!(file instanceof File)) {
      throw new FileIsRequiredError("No file found to upload");
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await this.minioClient.putObject(this.bucket, fileName, buffer);
    return result;
  }

  async uploadFileBuffers(formData: FormData, options?: MinioManagerUploadOptions) {
    const files = formData.getAll("file") as File[];
    const folderName = formData.get("folderName") as string;
    if (files.length === 0) {
      throw new FileIsRequiredError("No files found to upload");
    }

    //validate files uploaded
    if (options) {
      files.map((file) => {
        if (options.allowedFileTypes && !options.allowedFileTypes.includes(file.type)) {
          throw new FileTypeNotAllowedError("File type is not allowed");
        }
        if (options.maximumAllowedFileSize && file.size > options.maximumAllowedFileSize) {
          throw new FileSizeNotAllowedError("File Size exceeds the maximum allowed value.");
        }
      });
    }

    const fileInfos = await Promise.all(
      files.map(async (file, idx) => {
        if (file instanceof File) {
          const fileExt = "." + file.name.split(".")[file.name.split(".").length - 1];
          const modifiedFileName =
            (!folderName.endsWith("/") ? folderName + "/" : folderName) + idx.toString() + fileExt;

          const buffer = Buffer.from(await file.arrayBuffer());
          await this.minioClient.putObject(this.bucket, modifiedFileName, buffer);
          return modifiedFileName;
        }
      }),
    );
    return fileInfos;
  }

  async uploadFile(sourceFile: string, destinationObject: string) {
    try {
      const result = await this.minioClient.fPutObject(this.bucket, destinationObject, sourceFile);
      return result;
    } catch {
      throw new UnableToUploadError("Unable to upload file");
    }
  }

  async uploadFiles(files: UploadedFile[]) {
    try {
      const result = await Promise.all(
        files.map(async (file) => {
          return await this.uploadFile(file.source, file.name);
        }),
      );
      return result;
    } catch {
      throw new UnableToUploadError("Unable to upload files");
    }
  }
  //#endregion Uploads

  //#region Get File/s
  async getFile(fileName: string, folderName?: string) {
    try {
      folderName =
        typeof folderName === "undefined" || folderName === ""
          ? ""
          : !folderName.endsWith("/")
            ? folderName + "/"
            : folderName;
      const url = await this.minioClient.presignedUrl("GET", this.bucket, folderName + fileName);
      return url.split("?")[0];
    } catch {
      throw new FileNotFoundError(`${fileName} does not exists.`);
    }
  }

  async getFilesByFolder(folderName: string) {
    try {
      folderName = !folderName.endsWith("/") ? folderName + "/" : folderName;
      const files = [];
      const stream = this.minioClient.listObjectsV2(this.bucket, folderName, true);
      for await (const obj of stream) {
        files.push({
          name: obj.name as string,
          url: await this.getFile(obj.name),
        });
      }
      return files;
    } catch {
      throw new FileNotFoundError(`${folderName} does not exists.`);
    }
  }

  async getFileMimeType(fileName: string) {
    try {
      const stat = await this.minioClient.statObject(this.bucket, fileName);
      console.log("MIME Type:", stat.metaData["content-type"] || "Unknown");
      return stat.metaData["content-type"];
    } catch (err) {
      console.error("Error getting MIME type:", err);
    }
  }

  //#endregion Get File/s

  //#region Delete File/s
  async deleteFile(fileName: string, folderName?: string) {
    try {
      folderName =
        typeof folderName === "undefined" || folderName === ""
          ? ""
          : !folderName.endsWith("/")
            ? folderName + "/"
            : folderName;
      await this.minioClient.removeObject(this.bucket, folderName + fileName);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteFiles(folderName: string) {
    try {
      const files = await Promise.all(
        (await this.getFilesByFolder(folderName)).map(async (file) => file.name),
      );
      await this.minioClient.removeObjects(this.bucket, files);
      return files;
    } catch {
      throw new UnableToDeleteError("Unable to delete");
    }
  }

  async getbucketList() {
    try {
      //const url = await this.minioClient.listBuckets();
      console.log(env.MINIO_USE_SSL as boolean);
      return await this.minioClient;
    } catch (err) {
      console.error("test", err);
    }
  }
  //#endregion Delete File/s
}
