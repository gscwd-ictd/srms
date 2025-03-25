import { describe } from "node:test";
import { expect, it } from "vitest";
import { minioManager } from "@srms/server/app";
import fs from "fs";

describe("MinIO Custom Library Functions - Integration Testing", () => {
  it("Should upload and retrieve etag and version object of the file", async () => {
    const sampleFilePath = "/home/gscwd/Desktop/rv.jpeg";
    if (!fs.existsSync(sampleFilePath)) {
      throw new Error(`File not found: ${sampleFilePath}`);
    } else console.log("exists");
    const fileBuffer = fs.readFileSync(sampleFilePath);
    const arrayBuffer = fileBuffer.buffer.slice(
      fileBuffer.byteOffset,
      fileBuffer.byteOffset + fileBuffer.byteLength,
    );
    const formData = new FormData();
    const blob = new Blob([arrayBuffer], { type: "image/jpeg" });
    console.log(blob.size);
    const file = new File([blob], "file.jpg", { type: "image/jpeg" });
    console.log(file.size);
    formData.append("file", file as File, "file.jpg");
    formData.append("fileName", "test.jpg");
    const fileUpload = await minioManager.uploadFileBuffer(formData);
    console.log(fileUpload);
    // const fileUpload = {
    //   etag: "123456abcdef",
    //   versionId: "asd",
    // };

    await expect(minioManager.uploadFileBuffer(formData)).resolves.toMatchObject({
      etag: expect.any(String),
      versionId: expect.anything(),
    });
  });
});
