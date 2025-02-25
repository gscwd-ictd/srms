import * as Minio from 'minio';
import { HTTPError } from '@srms/server/errors';
import { NOT_FOUND } from '@srms/server/constants/httpStatusCodes';
import { UploadedFile } from './types';
import env from '@srms/utils/env';

export class MinioManager {
    //#region properties 
    private bucket = process.env.MINIO_BUCKET as string;

    private minioClient = new Minio.Client({
        endPoint: env.MINIO_ENDPOINT,
        port: env.MINIO_PORT,
        useSSL: env.MINIO_USE_SSL,
        accessKey: env.MINIO_ACCESS_KEY,
        secretKey: env.MINIO_SECRET,
    });
    //#endregion properties

    //#region Upload/s
    async uploadFileBuffer(formData: FormData) {
        try {
            const file = formData.get('file');
            const fileName = formData.get('fileName') as string;
            if (!(file instanceof File)) {
                throw new HTTPError(NOT_FOUND, 'No file uploaded', 'Minio Upload Error');
            }
            const buffer = Buffer.from(await file.arrayBuffer())
            const result = await this.minioClient.putObject(this.bucket, fileName, buffer);
            return result;
        }
        catch (error) {
            if (error instanceof HTTPError)
                throw new HTTPError(error.status, error.message, error.name);
        }
    }

    async uploadFileBuffers(formData: FormData) {
        try {
            const files = formData.getAll('file');
            const folderName = formData.get('folderName') as string;
            if (files.length === 0) {
                throw new HTTPError(NOT_FOUND, 'No file uploaded', 'Minio Upload Error');
            }

            const fileInfos = await Promise.all(files.map(async (file, idx) => {
                if (file instanceof File) {
                    const fileExt = '.' + file.name.split('.')[file.name.split('.').length - 1];
                    const modifiedFileName = (!folderName.endsWith("/") ? folderName + "/" : folderName) + idx.toString() + fileExt;

                    const buffer = Buffer.from(await file.arrayBuffer());
                    await this.minioClient.putObject(this.bucket, modifiedFileName, buffer);
                    return modifiedFileName;
                }
            }))
            return fileInfos;
        }
        catch (error) {
            if (error instanceof HTTPError)
                throw new HTTPError(error.status, error.message, error.name);
        }
    }

    async uploadFile(sourceFile: string, destinationObject: string) {
        try {
            const result = await this.minioClient.fPutObject(this.bucket, destinationObject, sourceFile);
            return result;
        }
        catch {
            throw new HTTPError(500, 'Unable to upload file', 'Minio Upload Error');
        }
    }

    async uploadFiles(files: UploadedFile[]) {
        try {
            const result = await Promise.all(files.map(async (file) => {
                return await this.uploadFile(file.source, file.name);
            }));
            return result;
        } catch {
            throw new HTTPError(500, 'Unable to upload files', 'Minio Upload Error');
        }
    }
    //#endregion Uploads

    //#region Get File/s
    async getFile(fileName: string, folderName?: string) {
        try {
            folderName = typeof folderName === 'undefined' || folderName === '' ? '' : !folderName.endsWith("/") ? folderName + "/" : folderName;
            const url = await this.minioClient.presignedUrl("GET", this.bucket, folderName + fileName);
            return url.split('?')[0];
        } catch {
            throw new HTTPError(404, 'Unable to get files', 'Minio Upload Error');
        }
    }

    async getFilesByFolder(folderName: string) {
        try {
            folderName = !folderName.endsWith("/") ? folderName + "/" : folderName;
            const files = [];
            const stream = this.minioClient.listObjectsV2(this.bucket, folderName, true);
            for await (const obj of stream) {
                files.push({
                    name: obj.name,
                    url: await this.getFile(obj.name)
                });
            }
            return files;
        }
        catch {
            throw new HTTPError(404, 'Unable to get files', 'Minio Upload Error');
        }
    }
    //#endregion Get File/s

    //#region Delete File/s
    async deleteFile(fileName: string, folderName?: string) {
        try {
            folderName = typeof folderName === 'undefined' || folderName === '' ? '' : !folderName.endsWith("/") ? folderName + "/" : folderName;
            await this.minioClient.removeObject(this.bucket, folderName + fileName);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async deleteFiles(folderName: string) {
        try {
            const files = await Promise.all((await this.getFilesByFolder(folderName)).map(async file => file.name));
            await this.minioClient.removeObjects(this.bucket, files);
            return files;
        }
        catch {
            throw new HTTPError(500, 'Unable to delete files', 'Minio Delete Error');
        }
    }
    //#endregion Delete File/s
}

export const minioManager = new MinioManager();
